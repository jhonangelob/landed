import { AppError } from './utils'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

function secretKey() {
  if (!process.env.PAYMONGO_SECRET_KEY) {
    throw new AppError(
      'MISSING_ENV',
      'API Key is not defined in the environment variables',
    )
  }
  return process.env.PAYMONGO_SECRET_KEY
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
