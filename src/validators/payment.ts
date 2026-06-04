import { z } from 'zod'

import { planIdSchema } from '#/validators/subscription'

// Payment method types supported by the PayMongo integration.
export const paymentMethodTypeSchema = z.enum([
  'card',
  'gcash',
  'paymaya',
  'grab_pay',
  'qrph',
])

export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>

// Card fields collected in the checkout form.
export const cardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{12,19}$/, 'Enter a valid card number (digits only)'),
  expMonth: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Invalid month'),
  expYear: z.string().regex(/^\d{4}$/, 'Invalid year'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
})

export type CardPaymentInput = z.infer<typeof cardPaymentSchema>

// Server function payloads.
// The amount is derived server-side from the plan — never trust a client amount.
export const createIntentSchema = z.object({
  planId: planIdSchema,
})

export const createMethodSchema = z.object({
  type: paymentMethodTypeSchema,
  cardNumber: z.string().optional(),
  expMonth: z.number().optional(),
  expYear: z.number().optional(),
  cvc: z.string().optional(),
})

export const attachMethodSchema = z.object({
  paymentIntentId: z.string(),
  paymentMethodId: z.string(),
  clientKey: z.string(),
  returnUrl: z.string().url(),
})

export const verifyIntentSchema = z.object({
  intentId: z.string(),
})
