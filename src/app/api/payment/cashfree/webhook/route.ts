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
        const { data: updatedRows } = await supabaseAdmin
          .from('contributions')
          .update({
            status: 'Success',
            pg_bank_ref_no: bankRef || null,
          })
          .eq('payment_id', orderId)
          .select();

        // If this order is an Anandamela stall booking
        const orderTags = orderData.order_tags || {};
        const isAnandamela = orderTags.order_type === 'anandamela' || (orderData.order_note || '').toLowerCase().includes('anandamela');

        if (isAnandamela) {
          // If no contribution row was found, insert one
          if (!updatedRows || updatedRows.length === 0) {
            await supabaseAdmin.from('contributions').insert({
              contributor_name: orderData.customer_details?.customer_name || 'Resident Chef',
              phone: (orderData.customer_details?.customer_phone || '').slice(-10),
              email: orderData.customer_details?.customer_email || null,
              flat_number: orderTags.flat_number || 'PBEL City',
              amount: orderData.order_amount || 1000,
              status: 'Success',
              payment_id: orderId,
              pg_bank_ref_no: bankRef || null,
              is_name_visible: true,
            });
          }

          // Sync into config_anandamela_stalls
          const { data: campData } = await supabaseAdmin
            .from('campaigns')
            .select('id, redirect_link')
            .eq('title', 'config_anandamela_stalls')
            .maybeSingle();

          let currentStalls: any[] = [];
          if (campData?.redirect_link) {
            try { currentStalls = JSON.parse(campData.redirect_link); } catch (_) {}
          }

          if (!currentStalls.some((s: any) => s.paymentRef === bankRef || s.paymentRef === orderId || s.id === orderId)) {
            const nextStallNum = `Stall #${String(currentStalls.length + 1).padStart(2, '0')}`;
            const newStallEntry = {
              id: `stall-${Date.now()}`,
              stallNumber: nextStallNum,
              stallName: orderTags.stall_name || orderData.order_note || 'Resident Food Stall',
              chefName: orderData.customer_details?.customer_name || 'Resident Home Chef',
              stallType: (orderTags.stall_type || 'Food') as any,
              tower: orderTags.tower || 'PBEL City',
              flatNumber: orderTags.flat_number || 'PBEL City',
              phone: orderData.customer_details?.customer_phone || '',
              category: orderTags.category || 'Festive Specialty',
              description: 'Home-cooked festive specialty prepared with love by PBEL City residents.',
              emoji: '🍲',
              status: 'Approved',
              tablesCount: Number(orderTags.tables_count) || 1,
              totalAmount: orderData.order_amount || 1000,
              paymentRef: bankRef || orderId,
              paymentStatus: 'Payment Verified',
              createdAt: new Date().toISOString(),
            };
            const updated = [newStallEntry, ...currentStalls];
            await supabaseAdmin.from('campaigns').upsert({
              title: 'config_anandamela_stalls',
              redirect_link: JSON.stringify(updated),
              is_active: true,
            });
          }
        }
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
