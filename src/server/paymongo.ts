import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import {
  attachPaymentMethod,
  createPaymentIntent,
  createPaymentMethod,
  retrievePaymentIntent,
} from '#/lib/paymongo'
import { applyPlan } from '#/lib/subscription/apply'
import { AppError } from '#/lib/utils'

import {
  attachMethodSchema,
  createIntentSchema,
  createMethodSchema,
  verifyIntentSchema,
} from '#/validators/payment'

import { getPlanById } from '#/constants/plan'

export const createIntentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createIntentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()
    const plan = getPlanById(data.planId)

    if (plan.price <= 0)
      throw new AppError(
        'VALIDATION_ERROR',
        'The selected plan does not require payment',
      )

    // Amount is derived from the plan and the buyer is bound via metadata so
    // fulfillment can later verify both server-side.
    const result = await createPaymentIntent(plan.price, plan.currency, {
      userId: session.user.id,
      planId: plan.id,
    })
    if (result.errors) throw new Error(result.errors[0].detail)

    const { id, attributes } = result.data
    return {
      paymentIntentId: id as string,
      clientKey: attributes.client_key as string,
    }
  })

export const createMethodFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createMethodSchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const details =
      data.type === 'card'
        ? {
            card_number: data.cardNumber,
            exp_month: data.expMonth,
            exp_year: data.expYear,
            cvc: data.cvc,
          }
        : {}

    const result = await createPaymentMethod(data.type, details)
    if (result.errors) throw new Error(result.errors[0].detail)

    return { paymentMethodId: result.data.id as string }
  })

export const attachMethodFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => attachMethodSchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const result = await attachPaymentMethod(
      data.paymentIntentId,
      data.paymentMethodId,
      data.clientKey,
      data.returnUrl,
    )
    if (result.errors) throw new Error(result.errors[0].detail)

    const { status, next_action } = result.data.attributes
    return {
      status: status as string,
      nextAction: next_action as { redirect?: { url?: string } } | null,
    }
  })

export const verifyIntentFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => verifyIntentSchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const result = await retrievePaymentIntent(data.intentId)
    return { status: (result.data?.attributes?.status ?? 'failed') as string }
  })

/**
 * Server-authoritative fulfillment. Verifies the intent with PayMongo and
 * grants the plan ONLY if the payment succeeded, belongs to the current user
 * (via metadata set at creation), and the amount paid matches the plan price.
 * The plan is read from the intent metadata — never from a client-supplied
 * value — which closes the price/parameter-tampering hole.
 */
export const fulfillIntentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => verifyIntentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const result = await retrievePaymentIntent(data.intentId)
    const attributes = result.data?.attributes
    if (!attributes) throw new AppError('NOT_FOUND', 'Payment not found')

    if (attributes.status !== 'succeeded')
      throw new AppError('VALIDATION_ERROR', 'Payment has not been completed')

    const metadata = (attributes.metadata ?? {}) as {
      userId?: string
      planId?: string
    }

    if (metadata.userId !== session.user.id)
      throw new AppError(
        'UNAUTHORIZED',
        'This payment does not belong to your account',
      )

    const plan = getPlanById(metadata.planId ?? '')
    if (plan.price <= 0)
      throw new AppError('VALIDATION_ERROR', 'Invalid plan for this payment')

    if (Number(attributes.amount) !== Math.round(plan.price * 100))
      throw new AppError(
        'VALIDATION_ERROR',
        'Payment amount does not match the selected plan',
      )

    await applyPlan(session.user.id, plan, data.intentId)

    return { success: true, planId: plan.id }
  })
