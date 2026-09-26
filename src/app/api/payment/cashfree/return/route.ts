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

      // 1. If this was an Anandamela stall booking: sync to database directly on server
      if (orderType === 'anandamela') {
        try {
          // Record in contributions table
          await supabaseAdmin.from('contributions').insert({
            contributor_name: order.customer_details?.customer_name || 'Resident Chef',
            phone: (order.customer_details?.customer_phone || '').slice(-10),
            email: order.customer_details?.customer_email || null,
            flat_number: order.order_tags?.flat_number || 'PBEL City',
            amount: order.order_amount || 1000,
            status: 'Success',
            payment_id: orderId,
            pg_bank_ref_no: bankReference,
            is_name_visible: true,
          });

          // Also record in config_anandamela_stalls in campaigns table
          const { data: campData } = await supabaseAdmin
            .from('campaigns')
            .select('id, redirect_link')
            .eq('title', 'config_anandamela_stalls')
            .maybeSingle();

          let currentStalls: any[] = [];
          if (campData?.redirect_link) {
            try { currentStalls = JSON.parse(campData.redirect_link); } catch (_) {}
          }

          if (!currentStalls.some((s: any) => s.paymentRef === bankReference || s.paymentRef === orderId || s.id === orderId)) {
            const nextStallNum = `Stall #${String(currentStalls.length + 1).padStart(2, '0')}`;
            const newStallEntry = {
              id: `stall-${Date.now()}`,
              stallNumber: nextStallNum,
              stallName: order.order_tags?.stall_name || order.order_note || 'Resident Food Stall',
              chefName: order.customer_details?.customer_name || 'Resident Home Chef',
              stallType: (order.order_tags?.stall_type || 'Food') as any,
              tower: order.order_tags?.tower || 'PBEL City',
              flatNumber: order.order_tags?.flat_number || 'PBEL City',
              phone: order.customer_details?.customer_phone || '',
              category: order.order_tags?.category || 'Festive Specialty',
              description: 'Home-cooked festive specialty prepared with love by PBEL City residents.',
              emoji: '🍲',
              status: 'Approved',
              tablesCount: Number(order.order_tags?.tables_count) || 1,
              totalAmount: order.order_amount || 1000,
              paymentRef: bankReference || orderId,
              paymentStatus: 'Payment Verified',
              createdAt: new Date().toISOString(),
            };
            const updated = [newStallEntry, ...currentStalls];
            if (campData?.id) {
              await supabaseAdmin
                .from('campaigns')
                .update({ redirect_link: JSON.stringify(updated), is_active: true })
                .eq('id', campData.id);
            } else {
              await supabaseAdmin.from('campaigns').insert({
                title: 'config_anandamela_stalls',
                image_url: 'config',
                redirect_link: JSON.stringify(updated),
                is_active: true,
              });
            }
          }
        } catch (stallSyncErr) {
          console.error('[Cashfree Return] Error syncing Anandamela stall to Supabase:', stallSyncErr);
        }

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
