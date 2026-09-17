import crypto from 'crypto';

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone: string;
}

export interface CashfreeOrderMeta {
  return_url: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface CashfreeCreateOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency?: string;
  customer_details: CashfreeCustomerDetails;
  order_meta: CashfreeOrderMeta;
  order_note?: string;
  order_tags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id?: string;
  order_id: string;
  entity?: string;
  order_currency?: string;
  order_amount?: number;
  order_status: 'PAID' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'FAILED' | string;
  payment_session_id?: string;
  order_token?: string;
  created_at?: string;
  order_meta?: CashfreeOrderMeta;
  customer_details?: CashfreeCustomerDetails;
  message?: string;
  code?: string;
  type?: string;
}

export interface CashfreePaymentEntity {
  cf_payment_id?: string;
  payment_status?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_message?: string;
  payment_time?: string;
  bank_reference?: string;
  payment_group?: string;
  payment_method?: any;
}

export const CASHFREE_API_VERSION = '2023-08-01';

export function getCashfreeConfig() {
  const appId = (process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '').trim();
  const secretKey = (process.env.CASHFREE_SECRET_KEY || '').trim();
  const env = (process.env.CASHFREE_ENV || 'SANDBOX').trim().toUpperCase();
  const isProd = env === 'PRODUCTION' || env === 'PROD';

  const baseUrl = isProd
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  return {
    appId,
    secretKey,
    env: isProd ? 'PRODUCTION' : 'SANDBOX',
    isProd,
    baseUrl,
    isConfigured: Boolean(appId && secretKey),
  };
}

export function getCashfreeHeaders() {
  const { appId, secretKey } = getCashfreeConfig();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-client-id': appId,
    'x-client-secret': secretKey,
    'x-api-version': CASHFREE_API_VERSION,
  };
}

/**
 * Server-side Order Creation via Cashfree REST API
 * https://www.cashfree.com/docs/payments/online/web/redirect#step-1-create-an-order
 */
export async function createCashfreeOrder(payload: CashfreeCreateOrderPayload): Promise<CashfreeOrderResponse> {
  const { baseUrl, isConfigured } = getCashfreeConfig();

  if (!isConfigured) {
    // If credentials are not yet entered by user, provide a mock sandbox response for safe test preview
    console.warn('[Cashfree] Warning: CASHFREE_APP_ID or CASHFREE_SECRET_KEY is missing. Using mock sandbox session.');
    return {
      order_id: payload.order_id,
      order_amount: payload.order_amount,
      order_currency: payload.order_currency || 'INR',
      order_status: 'ACTIVE',
      payment_session_id: `session_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      customer_details: payload.customer_details,
      order_meta: payload.order_meta,
    };
  }

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: getCashfreeHeaders(),
    body: JSON.stringify({
      order_id: payload.order_id,
      order_amount: payload.order_amount,
      order_currency: payload.order_currency || 'INR',
      customer_details: payload.customer_details,
      order_meta: payload.order_meta,
      order_note: payload.order_note || 'PBEL City Durgotsav 2026',
      order_tags: payload.order_tags,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || JSON.stringify(data);
    throw new Error(`Cashfree Order Creation Failed (${response.status}): ${errorMsg}`);
  }

  return data as CashfreeOrderResponse;
}

/**
 * Server-side Order Fetching / Status Verification
 * https://www.cashfree.com/docs/payments/online/web/redirect#step-3-confirm-the-payment
 */
export async function fetchCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const { baseUrl, isConfigured } = getCashfreeConfig();

  if (!isConfigured) {
    return {
      order_id: orderId,
      order_status: 'PAID', // In mock testing, treat as paid
      order_amount: 1000,
      order_currency: 'INR',
      payment_session_id: `session_mock_${orderId}`,
    };
  }

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || JSON.stringify(data);
    throw new Error(`Cashfree Fetch Order Failed (${response.status}): ${errorMsg}`);
  }

  return data as CashfreeOrderResponse;
}

/**
 * Server-side Order Payments Fetching (retrieves specific payment attempt, UTR, and method)
 */
export async function fetchCashfreeOrderPayments(orderId: string): Promise<CashfreePaymentEntity[]> {
  const { baseUrl, isConfigured } = getCashfreeConfig();

  if (!isConfigured) {
    return [
      {
        cf_payment_id: `cf_pay_${Date.now()}`,
        payment_status: 'SUCCESS',
        bank_reference: `UTR${Date.now().toString().slice(-8)}`,
        payment_group: 'upi',
      },
    ];
  }

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Cashfree Webhook Signature Verification
 * Cashfree uses HMAC-SHA256 signature calculated from (timestamp + rawBody) with secretKey
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): boolean {
  try {
    const { secretKey } = getCashfreeConfig();
    if (!secretKey) return false;

    const dataToSign = `${timestamp}${rawBody}`;

    // Base64 signature
    const expectedBase64 = crypto
      .createHmac('sha256', secretKey)
      .update(dataToSign)
      .digest('base64');

    // Hex signature
    const expectedHex = crypto
      .createHmac('sha256', secretKey)
      .update(dataToSign)
      .digest('hex');

    return signature === expectedBase64 || signature === expectedHex;
  } catch (err) {
    console.error('[Cashfree] Signature verification failed:', err);
    return false;
  }
}

/**
 * Client-side Cashfree JS SDK Loader
 * Dynamically loads https://sdk.cashfree.com/js/v3/cashfree.js on demand
 */
export async function loadCashfreeSDK(): Promise<any> {
  if (typeof window === 'undefined') return null;

  if ((window as any).Cashfree) {
    return (window as any).Cashfree;
  }

  return new Promise((resolve, reject) => {
    // Check if script element already exists
    const existing = document.querySelector('script[src*="cashfree.com/js/v3/cashfree.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).Cashfree));
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree);
      } else {
        reject(new Error('Cashfree SDK loaded but window.Cashfree is undefined'));
      }
    };
    script.onerror = (err) => reject(new Error('Failed to load Cashfree JS SDK from CDN: ' + err));
    document.head.appendChild(script);
  });
}
