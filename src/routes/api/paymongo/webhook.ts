import crypto from 'node:crypto'

import { createFileRoute } from '@tanstack/react-router'

function verifySignature(payload: string, sigHeader: string, secret: string) {
  const parts = sigHeader.split(',')
  const t = parts.find((p) => p.startsWith('t='))?.slice(2)
  const v1 = parts.find((p) => p.startsWith('v1='))?.slice(3)
  if (!t || !v1) return false

  const computed = crypto
    .createHmac('sha256', secret)
    .update(`${t}.${payload}`)
    .digest('hex')

  const expected = Buffer.from(computed)
  const received = Buffer.from(v1)
  // Length check first: timingSafeEqual throws on unequal-length buffers.
  if (expected.length !== received.length) return false
  return crypto.timingSafeEqual(expected, received)
}

// TODO: wire these to the real fulfillment flow (e.g. activate the user's
// subscription). There is no `orders` table yet, so these are intentionally
// thin placeholders that keep the webhook contract correct.
async function fulfillOrder(orderId: string | undefined) {
  console.log('paymongo: payment paid', { orderId })
}

async function markOrderFailed(orderId: string | undefined) {
  console.log('paymongo: payment failed', { orderId })
}

export const Route = createFileRoute('/api/paymongo/webhook')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.text()
        const sig = request.headers.get('Paymongo-Signature') ?? ''
        const secret = process.env.PAYMONGO_WEBHOOK_SECRET

        if (!secret) {
          return new Response('Webhook secret not configured', { status: 500 })
        }

        if (!verifySignature(body, sig, secret)) {
          return new Response('Unauthorized', { status: 401 })
        }

        let event: any
        try {
          event = JSON.parse(body)
        } catch {
          return new Response('Invalid payload', { status: 400 })
        }

        const type = event?.data?.attributes?.type
        const data = event?.data?.attributes?.data
        if (!type || !data) {
          return new Response('Invalid payload', { status: 400 })
        }

        switch (type) {
          case 'payment.paid':
            await fulfillOrder(data.attributes?.metadata?.orderId)
            break
          case 'payment.failed':
            await markOrderFailed(data.attributes?.metadata?.orderId)
            break
        }

        return new Response('ok', { status: 200 })
      },
    },
  },
})
