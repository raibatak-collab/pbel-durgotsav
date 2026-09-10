import { NextResponse } from 'next/server';
import { verifyIciciHash } from '@/utils/icici-pg';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });
    const receivedHash = payload['secureHash'];
    if (!receivedHash) return NextResponse.redirect(new URL('/contribute?error=missing_hash', request.url), 303);
    const isValid = verifyIciciHash(payload, receivedHash);
    if (!isValid) return NextResponse.redirect(new URL('/contribute?error=tampered_payment', request.url), 303);
    const { responseCode, merchantTxnNo } = payload;
    if (responseCode === '0000' || responseCode === '000') {
      await supabaseAdmin.from('contributions').update({ status: 'Approved' }).eq('payment_id', merchantTxnNo);
      return NextResponse.redirect(new URL(`/receipt?pid=${merchantTxnNo}`, request.url), 303);
    } else {
      await supabaseAdmin.from('contributions').update({ status: 'Rejected' }).eq('payment_id', merchantTxnNo);
      return NextResponse.redirect(new URL('/contribute?error=payment_failed', request.url), 303);
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/contribute?error=internal_error', request.url), 303);
  }
}
