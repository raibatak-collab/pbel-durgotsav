import { NextResponse } from 'next/server';
import { fetchCashfreeOrder, fetchCashfreeOrderPayments } from '@/utils/cashfree';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'order_id is required' }, { status: 400 });
    }

    const order = await fetchCashfreeOrder(orderId);
    let bankReference = order.cf_order_id || orderId;

    try {
      const payments = await fetchCashfreeOrderPayments(orderId);
      if (payments && payments.length > 0) {
        const successful = payments.find((p) => p.payment_status === 'SUCCESS') || payments[0];
        if (successful?.bank_reference) {
          bankReference = successful.bank_reference;
        } else if (successful?.cf_payment_id) {
          bankReference = String(successful.cf_payment_id);
        }
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.order_id,
        orderStatus: order.order_status,
        amount: order.order_amount,
        customerName: order.customer_details?.customer_name || 'PBEL Resident',
        customerPhone: order.customer_details?.customer_phone || '',
        customerEmail: order.customer_details?.customer_email || '',
        flatNumber: order.order_tags?.flat_number || 'PBEL City',
        note: order.order_note || 'Pujo Contribution',
        orderType: order.order_tags?.order_type || 'contribution',
        bankReference,
        createdAt: order.created_at || new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch Cashfree order status' },
      { status: 500 }
    );
  }
}
