import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCashfreeWebhookSignature, getCashfreeConfig } from '@/utils/cashfree';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';

    const config = getCashfreeConfig();

    // Verify signature only when secret key is configured
    if (config.isConfigured) {
      const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        console.error('[Cashfree Webhook] Invalid webhook signature detected.');
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = payload.type || payload.event || '';
    const orderData = payload.data?.order || payload.order || {};
    const paymentData = payload.data?.payment || payload.payment || {};
    const orderId = orderData.order_id || payload.data?.order_id;

    console.log(`[Cashfree Webhook] Received ${eventType} for order: ${orderId}`);

    if (orderId && (eventType.includes('SUCCESS') || eventType.includes('PAID'))) {
      const bankRef = paymentData.bank_reference || paymentData.cf_payment_id || orderData.cf_order_id;

      try {
        await supabaseAdmin
          .from('contributions')
          .update({
            status: 'Success',
            pg_bank_ref_no: bankRef || null,
          })
          .eq('payment_id', orderId);
      } catch (err) {
        console.error('[Cashfree Webhook] Error updating contribution status:', err);
      }
    } else if (orderId && eventType.includes('FAILED')) {
      try {
        await supabaseAdmin
          .from('contributions')
          .update({
            status: 'Failed',
          })
          .eq('payment_id', orderId);
      } catch (err) {}
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('[Cashfree Webhook] Handler error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
