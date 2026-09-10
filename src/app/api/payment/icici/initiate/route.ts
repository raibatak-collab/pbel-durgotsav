import { NextResponse } from 'next/server';
import { ICICI_CONFIG, generateIciciHashV2 } from '@/utils/icici-pg';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customerName, email, mobileNo, paymentId, isUAT } = body;

    // Use test credentials if explicitly testing, else check env
    const merchantId = isUAT ? 'T_S00067' : ICICI_CONFIG.merchantId;
    
    // As per ICICI Docs for Standard Integration (payType: "0")
    const payload = {
      merchantId: merchantId,
      merchantTxnNo: paymentId.replace(/[^a-zA-Z0-9]/g, ''),
      amount: parseFloat(amount).toFixed(2), // 9,2 decimal format
      currencyCode: "356",
      payType: "0", // 0 = Standard (Redirection)
      customerEmailID: email || "guest@icicibank.com",
      transactionType: "SALE",
      returnURL: ICICI_CONFIG.returnUrl,
      txnDate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14), // YYYYMMDDHHMISS
      customerMobileNo: mobileNo || "9999999999"
    };

    // Generate Hash
    const secureHash = generateIciciHashV2(payload);
    
    // Add hash to payload
    const finalPayload = {
      ...payload,
      secureHash
    };

    // Make request to ICICI
    const response = await fetch(ICICI_CONFIG.initiateSaleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload),
    });

    const data = await response.json();

    if (data.responseCode === 'R1000') {
      // Request initiated successfully
      return NextResponse.json({
        success: true,
        redirectURI: data.redirectURI,
        tranCtx: data.tranCtx
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.respDescription || 'Failed to initiate payment with ICICI'
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("ICICI Initiate Error:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
