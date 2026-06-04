import { z } from 'zod'

export const planIdSchema = z.enum(['economy', 'premium', 'business'])

export type PlanId = z.infer<typeof planIdSchema>

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

export type Plan = z.infer<typeof planSchema>

export const upgradeSchema = z.object({
  planId: planIdSchema,
})

export type UpgradeInput = z.infer<typeof upgradeSchema>

export const createSubscriptionSchema = z.object({
  userId: z.string(),
})

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>

export const subscriptionSchema = z.object({
  userId: z.string(),
  planId: planIdSchema,
  startedAt: z.date(),
  expiresAt: z.date().nullable(),
  isActive: z.boolean(),
  generationsUsed: z.number().min(0).default(0),
  generationsLimit: z.number().positive(),
})

export type Subscription = z.infer<typeof subscriptionSchema>
