import { z } from 'zod'

export const planIdSchema = z.enum(['economy', 'premium', 'business'])

export const planSchema = z.object({
  id: planIdSchema,
  name: z.string(),
  price: z.number().min(0),
  currency: z.string(),
  duration: z.number().positive().nullable(),
  generations: z.number().positive().nullable(),
  applications: z.number().positive().nullable(),
  features: z.array(z.string()),
})

export const subscriptionSchema = z.object({
  userId: z.string(),
  planId: planIdSchema,
  startedAt: z.date(),
  expiresAt: z.date().nullable(),
  isActive: z.boolean(),
  generationsUsed: z.number().min(0).default(0),
  generationsLimit: z.number().positive(),
})

export const createSubscriptionSchema = subscriptionSchema.pick({
  userId: true,
})

export const updateSubscriptionSchema = z.object({
  planId: planIdSchema,
})

export const createPaymentSchema = z.object({
  planId: planIdSchema,
})
