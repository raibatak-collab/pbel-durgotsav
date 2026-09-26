import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchCashfreeOrder, fetchCashfreeOrderPayments } from '@/utils/cashfree';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const order = await fetchCashfreeOrder(orderId);
    if (!order || order.order_status !== 'PAID') {
      return NextResponse.json({
        success: false,
        error: `Order ${orderId} status in Cashfree is "${order?.order_status || 'UNKNOWN'}", not PAID.`,
      }, { status: 400 });
    }

    let bankRef = order.cf_order_id || orderId;
    try {
      const payments = await fetchCashfreeOrderPayments(orderId);
      if (payments && payments.length > 0) {
        const successful = payments.find((p) => p.payment_status === 'SUCCESS') || payments[0];
        if (successful?.bank_reference) bankRef = successful.bank_reference;
        else if (successful?.cf_payment_id) bankRef = String(successful.cf_payment_id);
      }
    } catch (_) {}

    const orderTags = order.order_tags || {};

    // 1. Record in contributions table
    await supabaseAdmin.from('contributions').insert({
      contributor_name: order.customer_details?.customer_name || 'Resident Chef',
      phone: (order.customer_details?.customer_phone || '').slice(-10),
      email: order.customer_details?.customer_email || null,
      flat_number: orderTags.flat_number || 'PBEL City',
      amount: order.order_amount || 1000,
      status: 'Success',
      payment_id: orderId,
      pg_bank_ref_no: bankRef,
      is_name_visible: true,
    });

    // 2. Sync into config_anandamela_stalls
    const { data: campData } = await supabaseAdmin
      .from('campaigns')
      .select('id, redirect_link')
      .eq('title', 'config_anandamela_stalls')
      .maybeSingle();

    let currentStalls: any[] = [];
    if (campData?.redirect_link) {
      try { currentStalls = JSON.parse(campData.redirect_link); } catch (_) {}
    }

    let stall = currentStalls.find((s: any) => s.paymentRef === bankRef || s.paymentRef === orderId || s.id === orderId);

    if (!stall) {
      const nextStallNum = `Stall #${String(currentStalls.length + 1).padStart(2, '0')}`;
      stall = {
        id: `stall-${Date.now()}`,
        stallNumber: nextStallNum,
        stallName: orderTags.stall_name || order.order_note || 'Resident Food Stall',
        chefName: order.customer_details?.customer_name || 'Resident Home Chef',
        stallType: (orderTags.stall_type || 'Food') as any,
        tower: orderTags.tower || 'PBEL City',
        flatNumber: orderTags.flat_number || 'PBEL City',
        phone: order.customer_details?.customer_phone || '',
        category: orderTags.category || 'Festive Specialty',
        description: 'Home-cooked festive specialty prepared with love by PBEL City residents.',
        emoji: '🍲',
        status: 'Approved',
        tablesCount: Number(orderTags.tables_count) || 1,
        totalAmount: order.order_amount || 1000,
        paymentRef: bankRef,
        paymentStatus: 'Payment Verified',
        createdAt: order.created_at || new Date().toISOString(),
      };
      const updated = [stall, ...currentStalls];
      await supabaseAdmin.from('campaigns').upsert({
        title: 'config_anandamela_stalls',
        redirect_link: JSON.stringify(updated),
        is_active: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully verified and restored stall for ${stall.chefName} (${stall.stallName})`,
      stall,
    });
  } catch (err: any) {
    console.error('Error syncing order from Cashfree:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to sync order' }, { status: 500 });
  }
}
