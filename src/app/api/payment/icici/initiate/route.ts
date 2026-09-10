import { NextResponse } from 'next/server';
import { ICICI_CONFIG, generateIciciHashV1 } from '@/utils/icici-pg';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customerName, email, mobileNo, paymentId, isUAT } = body;

    const merchantId = isUAT ? '100000000007164' : ICICI_CONFIG.merchantId;
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || 'www.pbelcitydurgotsav.com';
    const dynamicReturnUrl = `${protocol}://${host}/api/payment/icici/callback`;
    const aggregatorID = isUAT ? 'A100000000007164' : ICICI_CONFIG.aggregatorID;
    
    // Clean payment ID to be strictly alphanumeric
    const cleanPaymentId = paymentId.replace(/[^a-zA-Z0-9]/g, '');

    const payload = {
      merchantId: merchantId,
      aggregatorID: aggregatorID,
      merchantTxnNo: cleanPaymentId,
      amount: parseFloat(amount).toFixed(2), // 9,2 decimal format
      currencyCode: "356",
      payType: "0", // 0 = Standard (Redirection)
      customerEmailID: email || "guest@icicibank.com",
      customerName: customerName || "Guest Devotee",
      transactionType: "SALE",
      returnURL: dynamicReturnUrl,
      txnDate: new Date().toISOString().split('T')[0].replace(/-/g, '') + '235959', // Must end in 235959 as per ICICI docs
      customerMobileNo: mobileNo || "9999999999"
    };

    // IMPORTANT: Even for v2 endpoints, ICICI requires the V1 (Concatenation) hash logic
    const secureHash = generateIciciHashV1(payload);
    
    const finalPayload = {
      ...payload,
      secureHash
    };

    const response = await fetch(ICICI_CONFIG.initiateSaleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload),
    });

    const data = await response.json();

    if (data.responseCode === 'R1000') {
      return NextResponse.json({
        success: true,
        redirectURI: data.redirectURI,
        tranCtx: data.tranCtx
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.respDescription || data.responseDescription || 'Failed to initiate payment with ICICI',
        details: data
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("ICICI Initiate Error:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
