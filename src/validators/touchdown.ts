import z from 'zod'

export const statsSnapshotSchema = z.object({
  company: z.string(),
  role: z.string(),
  planTier: z.string(),
  previousCompany: z.string().optional(),
  previousRole: z.string().optional(),
  appliedAt: z.string().nullable(),
  landedAt: z.string(),
  compensation: z.string().optional(),
  location: z.string().optional(),
  appliedCount: z.number(),
  interviewedCount: z.number(),
  daysCount: z.number(),
})

export const getTouchdownShareSchema = z.object({ shareToken: z.string() })

export const getShareTokenSchema = z.object({
  applicationId: z.string().uuid(),
})
