import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchCashfreeOrder, fetchCashfreeOrderPayments } from '@/utils/cashfree';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id');
  const orderType = url.searchParams.get('type') || 'contribution';

  if (!orderId) {
    return NextResponse.redirect(new URL('/contribute?error=missing_order_id', request.url), 303);
  }

  try {
    // Verify order status directly from Cashfree backend
    const order = await fetchCashfreeOrder(orderId);

    if (order.order_status === 'PAID') {
      let bankReference = order.cf_order_id || orderId;

      try {
        const payments = await fetchCashfreeOrderPayments(orderId);
        if (payments && payments.length > 0) {
          const successfulPayment = payments.find((p) => p.payment_status === 'SUCCESS') || payments[0];
          if (successfulPayment?.bank_reference) {
            bankReference = successfulPayment.bank_reference;
          } else if (successfulPayment?.cf_payment_id) {
            bankReference = String(successfulPayment.cf_payment_id);
          }
        }
      } catch (payErr) {
        console.warn('[Cashfree Return] Failed to fetch specific payments list:', payErr);
      }

      // 1. If this was an Anandamela stall booking
      if (orderType === 'anandamela') {
        return NextResponse.redirect(
          new URL(`/anandamela?status=success&order_id=${encodeURIComponent(orderId)}&ref=${encodeURIComponent(bankReference)}`, request.url),
          303
        );
      }

      // 2. Otherwise it's a devotee contribution: Update Supabase
      try {
        await supabaseAdmin
          .from('contributions')
          .update({
            status: 'Success',
            pg_bank_ref_no: bankReference,
          })
          .eq('payment_id', orderId);
      } catch (dbErr) {
        console.error('[Cashfree Return] Error updating contribution status in Supabase:', dbErr);
      }

      // Redirect to official receipt page
      return NextResponse.redirect(
        new URL(`/receipt?id=${encodeURIComponent(orderId)}&status=success&gateway=cashfree`, request.url),
        303
      );
    } else {
      // Payment was not completed or failed
      if (orderType === 'contribution') {
        try {
          await supabaseAdmin
            .from('contributions')
            .update({ status: 'Failed' })
            .eq('payment_id', orderId);
        } catch (e) {}

        return NextResponse.redirect(
          new URL(`/contribute?error=payment_failed&order_id=${encodeURIComponent(orderId)}`, request.url),
          303
        );
      } else {
        return NextResponse.redirect(
          new URL(`/anandamela?error=payment_failed&order_id=${encodeURIComponent(orderId)}`, request.url),
          303
        );
      }
    }
  } catch (error: any) {
    console.error('[Cashfree Return] Verification error:', error);
    const fallbackPath = orderType === 'anandamela' ? '/anandamela' : '/contribute';
    return NextResponse.redirect(
      new URL(`${fallbackPath}?error=verification_failed&order_id=${encodeURIComponent(orderId)}`, request.url),
      303
    );
  }
}
