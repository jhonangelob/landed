import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session.server'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'
import { applyMonthlyReset } from '#/lib/subscription/reset'
import { AppError } from '#/lib/utils'

import { createPaymentSchema } from '#/validators/subscription'

import { getPlanById } from '#/constants/plan'

export const getSubscription = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .then((r) => r.at(0) ?? null)

    if (!result) throw new AppError('NOT_FOUND', 'Subscription not found')

    return await applyMonthlyReset(result)
  },
)

export const createQrPhPayment = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createPaymentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const plan = getPlanById(data.planId)

    if (!process.env.PAYMONGO_SECRET_KEY) {
      throw new AppError(
        'MISSING_ENV',
        'API Key is not defined in the environment variables',
      )
    }

    const auth_header = `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`

    const intentRes = await fetch(
      'https://api.paymongo.com/v1/payment_intents',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth_header,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              amount: plan.price * 100,
              currency: 'PHP',
              payment_method_allowed: ['qrph'],
              metadata: { userId: session.user.id, planId: data.planId },
            },
          },
        }),
      },
    )

    const intent = await intentRes.json()

    if (!intentRes.ok) {
      throw new AppError(
        'INTERNAL_ERROR',
        intent.errors?.[0]?.detail ?? 'Failed to create payment intent',
      )
    }

    const pmRes = await fetch('https://api.paymongo.com/v1/payment_methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth_header,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            type: 'qrph',
            billing: { name: session.user.name, email: session.user.email },
          },
        },
      }),
    })

    const pm = await pmRes.json()

    if (!pmRes.ok) {
      throw new AppError(
        'INTERNAL_ERROR',
        pm.errors?.[0]?.detail ?? 'Failed to create payment method',
      )
    }

    const attachRes = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${intent.data.id}/attach`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth_header,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method: pm.data.id,
              client_key: intent.data.attributes.client_key,
            },
          },
        }),
      },
    )

    const attached = await attachRes.json()

    if (!attachRes.ok) {
      throw new AppError(
        'INTERNAL_ERROR',
        attached.errors?.[0]?.detail ?? 'Failed to attach payment method',
      )
    }

    // Todo: Remove after testing payment
    console.log(attached.data.attributes.next_action.code.test_url)

    return {
      intentId: intent.data.id,
      qrCodeUrl: attached.data.attributes.next_action.code.image_url,
      status: attached.data.attributes.status,
    }
  })
