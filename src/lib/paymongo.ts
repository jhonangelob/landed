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

export async function retrievePaymentIntent(intentId: string) {
  return paymongoFetch(`/payment_intents/${intentId}`, { method: 'GET' })
}
