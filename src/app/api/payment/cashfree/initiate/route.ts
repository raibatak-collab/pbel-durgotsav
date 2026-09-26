import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createCashfreeOrder, getCashfreeConfig } from '@/utils/cashfree';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      customerName,
      email,
      phone,
      flatNumber,
      purpose,
      categoryId,
      orderType = 'contribution',
      isNameVisible = true,
      metadata = {},
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount. Amount must be greater than zero.' },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'A valid 10-digit mobile number is required.' },
        { status: 400 }
      );
    }

    const cleanName = (customerName || 'PBEL Resident').trim();
    const cleanEmail = (email || 'devotee@pbelcitydurgotsav.com').trim();
    const cleanFlat = (flatNumber || 'PBEL City').trim();

    // Unique order ID format accepted by Cashfree (max 45 chars, alphanumeric and underscore)
    const orderId = `PSS26_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Resolve base URL dynamically for redirects
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || 'www.pbelcitydurgotsav.com';
    const baseUrl = `${protocol}://${host}`;

    // Save pending record in Supabase for tracking before redirecting to PG
    try {
      await supabaseAdmin.from('contributions').insert({
        contributor_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        flat_number: cleanFlat,
        amount: numAmount,
        category_id: categoryId || null,
        status: 'Pending',
        is_name_visible: Boolean(isNameVisible),
        payment_id: orderId,
      });
    } catch (dbErr) {
      console.warn('[Cashfree Initiate] Supabase pending insert notice:', dbErr);
    }

    // Call Cashfree API to create order session
    const orderRes = await createCashfreeOrder({
      order_id: orderId,
      order_amount: numAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${cleanPhone}`,
        customer_name: cleanName,
        customer_email: cleanEmail,
        customer_phone: cleanPhone,
      },
      order_meta: {
        return_url: `${baseUrl}/api/payment/cashfree/return?order_id={order_id}&type=${encodeURIComponent(orderType)}`,
        notify_url: `${baseUrl}/api/payment/cashfree/webhook`,
      },
      order_note: `PBEL Durgotsav 2026 - ${purpose || (orderType === 'anandamela' ? 'Anandamela Stall' : 'Contribution')}`.slice(0, 80),
      order_tags: {
        order_type: orderType,
        flat_number: cleanFlat.slice(0, 40),
        ...metadata,
      },
    });

    const config = getCashfreeConfig();

    return NextResponse.json({
      success: true,
      orderId: orderRes.order_id,
      paymentSessionId: orderRes.payment_session_id,
      orderStatus: orderRes.order_status,
      environment: config.isProd ? 'production' : 'sandbox',
    });
  } catch (error: any) {
    console.error('[Cashfree Initiate] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate Cashfree order.' },
      { status: 500 }
    );
  }
}
