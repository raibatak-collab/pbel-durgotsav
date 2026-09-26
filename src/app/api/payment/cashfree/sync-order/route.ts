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

    // Parse tower and flat number
    let rawFlat = orderTags.flat_number || 'PBEL City';
    let tower = orderTags.tower || 'PBEL City';
    let flatNumber = rawFlat;
    if (rawFlat.includes(' - ')) {
      const parts = rawFlat.split(' - ');
      tower = parts[0].trim();
      flatNumber = parts[1].trim();
    }

    const stallName = orderTags.stall_name || order.order_note || 'Resident Food Stall';
    const chefName = order.customer_details?.customer_name || 'Resident Home Chef';
    const isNonFood = /souvenir|jewel|craft|cloth|apparel|art|decor/i.test(stallName) || orderTags.stall_type === 'Non-Food';
    const stallType = isNonFood ? 'Non-Food' : (orderTags.stall_type || 'Food');
    const emoji = isNonFood ? '🎁' : '🍲';

    // 1. Record / update in contributions table
    try {
      const { data: anandaCat } = await supabaseAdmin
        .from('contribution_categories')
        .select('id')
        .ilike('name', '%Anandamela%')
        .maybeSingle();
      const catId = anandaCat?.id || 'af82fca7-b267-422b-a4e0-3dedfdf916d5';

      const { data: existingContrib } = await supabaseAdmin
        .from('contributions')
        .select('id')
        .eq('payment_id', orderId)
        .maybeSingle();

      if (existingContrib) {
        await supabaseAdmin
          .from('contributions')
          .update({
            status: 'Success',
            pg_bank_ref_no: bankRef,
            flat_number: `${tower} - ${flatNumber}`,
            category_id: catId,
          })
          .eq('id', existingContrib.id);
      } else {
        await supabaseAdmin.from('contributions').insert({
          contributor_name: chefName,
          phone: (order.customer_details?.customer_phone || '').slice(-10),
          email: order.customer_details?.customer_email || null,
          flat_number: `${tower} - ${flatNumber}`,
          amount: order.order_amount || 1000,
          category_id: catId,
          status: 'Success',
          payment_id: orderId,
          pg_bank_ref_no: bankRef,
          is_name_visible: true,
        });
      }
    } catch (cErr) {
      console.warn('[Cashfree Sync] Contributions sync notice:', cErr);
    }

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

    let stall = currentStalls.find((s: any) =>
      s.paymentRef === bankRef ||
      s.paymentRef === orderId ||
      s.id === orderId ||
      (s.phone === (order.customer_details?.customer_phone || '').slice(-10) && s.chefName.toLowerCase() === chefName.toLowerCase())
    );

    if (!stall) {
      stall = {
        id: `stall-${Date.now()}`,
        stallNumber: `Stall #${String(currentStalls.length + 1).padStart(2, '0')}`,
        stallName,
        chefName,
        stallType,
        tower,
        flatNumber,
        phone: (order.customer_details?.customer_phone || '').slice(-10),
        category: orderTags.category || (isNonFood ? 'Handicrafts & Art' : 'Festive Specialty'),
        description: isNonFood ? 'Festive items, curated souvenirs and community creations curated with passion by PBEL City residents.' : 'Home-cooked festive specialty prepared with love by PBEL City residents.',
        emoji,
        status: 'Approved',
        tablesCount: Number(orderTags.tables_count) || 1,
        totalAmount: order.order_amount || 1000,
        paymentRef: bankRef,
        paymentStatus: 'Payment Verified',
        createdAt: order.created_at || new Date().toISOString(),
      };
      currentStalls.push(stall);
    } else {
      // Update existing stall details
      stall.status = 'Approved';
      stall.paymentStatus = 'Payment Verified';
      stall.paymentRef = bankRef;
      stall.totalAmount = order.order_amount || stall.totalAmount;
    }

    // Sort chronologically ascending and re-sequence stallNumber
    currentStalls.sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    const resequenced = currentStalls.map((s: any, idx: number) => ({
      ...s,
      stallNumber: `Stall #${String(idx + 1).padStart(2, '0')}`,
      status: 'Approved',
      paymentStatus: 'Payment Verified',
    }));

    // Reverse for display (newest first)
    const finalStalls = [...resequenced].reverse();

    // Save back to campaigns using update by id
    if (campData?.id) {
      const { error: updErr } = await supabaseAdmin
        .from('campaigns')
        .update({ redirect_link: JSON.stringify(finalStalls), is_active: true })
        .eq('id', campData.id);
      if (updErr) {
        console.error('[Cashfree Sync] Campaigns update error:', updErr);
        throw new Error(`Failed to update campaigns table: ${updErr.message}`);
      }
    } else {
      const { error: insErr } = await supabaseAdmin
        .from('campaigns')
        .insert({
          title: 'config_anandamela_stalls',
          image_url: 'config',
          redirect_link: JSON.stringify(finalStalls),
          is_active: true,
        });
      if (insErr) {
        console.error('[Cashfree Sync] Campaigns insert error:', insErr);
        throw new Error(`Failed to insert campaigns table: ${insErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully verified and restored stall for ${stall.chefName} (${stall.stallName})`,
      stall,
      stalls: finalStalls,
    });
  } catch (err: any) {
    console.error('Error syncing order from Cashfree:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to sync order' }, { status: 500 });
  }
}
