import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session.server'

import { retrievePaymentIntent } from '#/lib/paymongo'
import { applyPlan } from '#/lib/subscription/apply'
import { AppError } from '#/lib/utils'

import { verifyIntentSchema } from '#/validators/payment'

import { getPlanById } from '#/constants/plan'

export const verifyIntentFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => verifyIntentSchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const result = await retrievePaymentIntent(data.intentId)
    return { status: (result.data?.attributes?.status ?? 'failed') as string }
  })

/**
 * Loads a QR Ph payment for the checkout page: the QR image to scan, the plan
 * being purchased, and the current status. The intent is verified to belong to
 * the current user so one buyer can never view another's payment.
 */
export const getQrPaymentFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => verifyIntentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const result = await retrievePaymentIntent(data.intentId)
    const attributes = result.data?.attributes
    if (!attributes) throw new AppError('NOT_FOUND', 'Payment not found')

    const metadata = (attributes.metadata ?? {}) as {
      userId?: string
      planId?: string
    }

    if (metadata.userId !== session.user.id)
      throw new AppError(
        'UNAUTHORIZED',
        'This payment does not belong to your account',
      )

    return {
      status: attributes.status as string,
      qrCodeImageUrl: (attributes.next_action?.code?.image_url ?? null) as
        | string
        | null,
      planId: metadata.planId ?? '',
    }
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
