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
  jobUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  location: z.string().or(z.literal('')),
  salaryRange: z.string().or(z.literal('')),
  notes: z.string().optional(),
  status: applicationStatusSchema.default('spotted'),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>

export const updateApplicationSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url('Must be a valid URL').nullable().or(z.literal('')),
  location: z.string().nullable(),
  salaryRange: z.string().nullable(),
  notes: z.string().nullable(),
  status: applicationStatusSchema,

  // timestamps — optional, only set when stage changes
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

export const deleteApplicationSchema = z.object({
  id: z.string(),
})
