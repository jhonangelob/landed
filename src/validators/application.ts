import { z } from 'zod'

export const applicationStatusSchema = z.enum([
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
])

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>

export const createApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  status: applicationStatusSchema.default('spotted'),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>

export const updateApplicationSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1, 'Company name is required').optional(),
  jobTitle: z.string().min(1, 'Job title is required').optional(),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  isRemote: z.boolean().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  status: applicationStatusSchema.optional(),
  appliedAt: z.string().datetime().optional(),
  interviewAt: z.string().datetime().optional(),
  offerAt: z.string().datetime().optional(),
  landedAt: z.string().datetime().optional(),
  rejectedAt: z.string().datetime().optional(),
})

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>

export const updateStatusSchema = z.object({
  id: z.string().uuid('Invalid application ID'),
  status: applicationStatusSchema,
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
