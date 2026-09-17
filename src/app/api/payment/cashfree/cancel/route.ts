import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, reason = 'Modal dismissed by user', orderType = 'contribution' } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
    }

    if (orderType === 'contribution') {
      // Only update if current status is still Pending to protect confirmed payments
      const { error } = await supabaseAdmin
        .from('contributions')
        .update({
          status: 'Cancelled',
        })
        .eq('payment_id', orderId)
        .eq('status', 'Pending');

      if (error) {
        console.warn('[Cashfree Cancel] Could not update contribution status:', error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} marked as Cancelled`,
    });
  } catch (err: any) {
    console.error('[Cashfree Cancel Route Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update order cancellation status.' },
      { status: 500 }
    );
  }
}
