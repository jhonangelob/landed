import { z } from 'zod'

export const applicationStageSchema = z.enum([
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
])

export type ApplicationStage = z.infer<typeof applicationStageSchema>

export const createApplicationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  description: z.string().or(z.literal('')),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>

export const updateApplicationSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  url: z.string().or(z.literal('')),
  location: z.string().or(z.literal('')),
  salaryRange: z.string().or(z.literal('')),
  notes: z.string().or(z.literal('')),
  stage: applicationStageSchema,
  status: z.string().or(z.literal('')),
  description: z.string().or(z.literal('')),
})

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>

export const updateStageSchema = z.object({
  id: z.string().uuid('Invalid application ID'),
  stage: applicationStageSchema,
})

export type UpdateStageInput = z.infer<typeof updateStageSchema>

export const deleteApplicationSchema = z.object({
  id: z.string(),
})

export type Application = {
  id: string
  company: string
  role: string
  description: string | null
  url: string | null
  location: string | null
  salaryRange: string | null
  notes: string | null
  stage: ApplicationStage
  status: string | null

  appliedAt: Date | null
  interviewAt: Date | null
  createdAt: Date
  updatedAt: Date
  offerAt: Date | null
}
