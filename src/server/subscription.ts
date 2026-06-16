import { getUsageInfo } from '#/helper/usage'
import { and, eq, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import {
  createPaymentSchema,
  createSubscriptionSchema,
} from '#/validators/subscription'

import { FREE_PLAN, getPlanById } from '#/constants/plan'

export const getSubscription = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .then((r) => r.at(0) ?? null)

    if (!result) throw new AppError('NOT_FOUND', 'Subscription not found')

    return result
  },
)

export const createSubscription = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createSubscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    await db
      .insert(subscriptions)
      .values({
        userId: data.userId,
        planId: FREE_PLAN.id,
        generationsUsed: 0,
        generationsLimit: FREE_PLAN.generations,
      })
      .onConflictDoNothing({ target: subscriptions.userId })
  })

export const checkGenerationLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)
      .then((r) => r.at(0) ?? null)

    if (!sub)
      throw new AppError(
        'SUBSCRIPTION_NOT_FOUND',
        'No active subscription found — please refresh and try again',
      )

    const usage = getUsageInfo(sub)

    if (!usage.unlimited && usage.remaining <= 0)
      throw new AppError(
        'GENERATION_LIMIT_REACHED',
        'You have used all of your generations on the Economy plan',
      )

    return usage
  },
)

export const increaseGenerationUsed = createServerFn({
  method: 'POST',
}).handler(async () => {
  const session = await ensureSession()

  const updated = await db
    .update(subscriptions)
    .set({
      generationsUsed: sql`${subscriptions.generationsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(subscriptions.userId, session.user.id),
        sql`(${subscriptions.generationsLimit} IS NULL OR ${subscriptions.generationsUsed} < ${subscriptions.generationsLimit})`,
      ),
    )
    .returning()

  if (updated.length === 0) {
    throw new AppError(
      'GENERATION_LIMIT_REACHED',
      'Generation limit reached — upgrade your plan to continue',
    )
  }

  return getUsageInfo(updated[0])
})

export const createQrPhPayment = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createPaymentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const plan = getPlanById(data.planId)
    const auth_header = `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`

    // 1. create payment intent
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

    // 2. create payment method
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

    // 3. attach
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

    return {
      intentId: intent.data.id,
      qrCodeUrl: attached.data.attributes.next_action.code.image_url,
      status: attached.data.attributes.status,
    }
  })
