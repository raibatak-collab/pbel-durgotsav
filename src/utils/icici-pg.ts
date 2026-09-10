import crypto from 'crypto';

export const ICICI_CONFIG = {
  merchantId: process.env.ICICI_MERCHANT_ID || '100000000007164',
  aggregatorID: process.env.ICICI_AGGREGATOR_ID || 'A100000000007164',
  secretKey: process.env.ICICI_SECRET_KEY || 'db06cca0-838b-4e01-8b20-6ac446ffb6bd',
  initiateSaleUrl: process.env.ICICI_INITIATE_SALE_URL || 'https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale',
  returnUrl: process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/icici/callback`
    : 'http://localhost:3000/api/payment/icici/callback',
};

// V1 Hash logic (Concatenation) - Required for both initiateSale and callbacks
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
