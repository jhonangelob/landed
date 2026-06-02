import crypto from 'node:crypto'

import { createFileRoute } from '@tanstack/react-router'

function verifySignature(payload: string, sigHeader: string, secret: string) {
  const [tPart, v1Part] = sigHeader.split(',')
  const t = tPart.replace('t=', '')
  const v1 = v1Part.replace('v1=', '')
  const computed = crypto
    .createHmac('sha256', secret)
    .update(`${t}.${payload}`)
    .digest('hex')
  return computed === v1
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

        const event = JSON.parse(body)
        const { type, data } = event.data.attributes

        switch (type) {
          case 'payment.paid':
            await fulfillOrder(data.attributes.metadata?.orderId)
            break
          case 'payment.failed':
            await markOrderFailed(data.attributes.metadata?.orderId)
            break
        }

        return new Response('ok', { status: 200 })
      },
    },
  },
})
