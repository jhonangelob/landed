import { createServerFn } from '@tanstack/react-start'

import {
  attachPaymentMethod,
  createPaymentIntent,
  createPaymentMethod,
  retrievePaymentIntent,
} from '#/lib/paymongo'

import {
  attachMethodSchema,
  createIntentSchema,
  createMethodSchema,
  verifyIntentSchema,
} from '#/validators/payment'

export const createIntentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createIntentSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await createPaymentIntent(data.amount, data.currency)
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
    const result = await retrievePaymentIntent(data.intentId)
    return { status: (result.data?.attributes?.status ?? 'failed') as string }
  })
