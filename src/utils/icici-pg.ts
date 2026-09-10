import crypto from 'crypto';

export const ICICI_CONFIG = {
  merchantId: process.env.ICICI_MERCHANT_ID || 'T_S00067',
  secretKey: process.env.ICICI_SECRET_KEY || '1033eedc162c60a3dc4ed6c51fb73ddbc6f01d21d28f77cea20140747514144e',
  initiateSaleUrl: process.env.ICICI_INITIATE_SALE_URL || 'https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale',
  returnUrl: process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/icici/callback`
    : 'http://localhost:3000/api/payment/icici/callback',
};

export function generateIciciHashV2(payloadObj: any, secretKey: string = ICICI_CONFIG.secretKey): string {
  const jsonString = JSON.stringify(payloadObj);
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(jsonString, 'utf8');
  return hmac.digest('hex').toLowerCase();
}

export function generateIciciHashV1(payload: Record<string, string>, secretKey: string = ICICI_CONFIG.secretKey): string {
  const sortedKeys = Object.keys(payload).sort();
  let concatenatedValues = '';
  for (const key of sortedKeys) {
    if (key === 'secureHash') continue;
    const val = payload[key];
    if (val !== null && val !== undefined && val !== '') {
      concatenatedValues += val;
    }
  }
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(concatenatedValues, 'utf8');
  return hmac.digest('hex').toLowerCase();
}

export function verifyIciciHash(payload: Record<string, string>, receivedHash: string, secretKey: string = ICICI_CONFIG.secretKey): boolean {
  const calculatedHash = generateIciciHashV1(payload, secretKey);
  return calculatedHash === receivedHash.toLowerCase();
}
