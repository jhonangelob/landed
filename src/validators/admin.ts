import { z } from 'zod'

export const adminStatsPeriodSchema = z.enum(['7d', '30d', '90d'])

export const adminStatsSchema = z.object({
  period: adminStatsPeriodSchema,
})

export type AdminStatsPeriod = z.infer<typeof adminStatsPeriodSchema>

export const createCodesSchema = z.object({
  planId: z.enum(['premium', 'business']),
  quantity: z.number().int().min(1).max(100),
})

export type CreateCodesInput = z.infer<typeof createCodesSchema>
export type CodePlanId = CreateCodesInput['planId']
