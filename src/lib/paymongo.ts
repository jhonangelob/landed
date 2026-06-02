// Thin wrapper around the PayMongo Payment Intents API.
// Use a PayMongo *test* secret key (sk_test_…) for dev testing — the calls hit
// the real API but no money moves. See https://developers.paymongo.com.

const PAYMONGO_API = 'https://api.paymongo.com/v1'

function secretKey() {
  const key = process.env.PAYMONGO_SECRET_KEY
  if (!key) {
    throw new Error(
      'PAYMONGO_SECRET_KEY is not set. Add your PayMongo test secret key (sk_test_…) to .env to enable payments.',
    )
  }
  return key
}

function authHeader() {
  return `Basic ${Buffer.from(`${secretKey()}:`).toString('base64')}`
}

async function paymongoFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  return res.json()
}

// ── Public API ───────────────────────────────────────────────

export async function createPaymentIntent(amount: number, currency = 'PHP') {
  return paymongoFetch('/payment_intents', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        attributes: {
          amount: Math.round(amount * 100),
          currency,
          payment_method_allowed: [
            'card',
            'gcash',
            'paymaya',
            'grab_pay',
            'qrph',
          ],
          capture_type: 'automatic',
        },
      },
    }),
  })
}

export async function createPaymentMethod(type: string, details: object = {}) {
  return paymongoFetch('/payment_methods', {
    method: 'POST',
    body: JSON.stringify({ data: { attributes: { type, details } } }),
  })
}

export async function attachPaymentMethod(
  paymentIntentId: string,
  paymentMethodId: string,
  clientKey: string,
  returnUrl: string,
) {
  return paymongoFetch(`/payment_intents/${paymentIntentId}/attach`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        attributes: {
          payment_method: paymentMethodId,
          client_key: clientKey,
          return_url: returnUrl,
        },
      },
    }),
  })
}

export async function retrievePaymentIntent(intentId: string) {
  return paymongoFetch(`/payment_intents/${intentId}`, { method: 'GET' })
}
