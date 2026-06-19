import z from 'zod'

import { applicationStageSchema } from './shared'

export const applicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  url: z.string().url('Must be a valid URL').or(z.literal('')).nullable(),
  location: z.string().or(z.literal('')).nullable(),
  salaryRange: z.string().or(z.literal('')).nullable(),
  notes: z.string().or(z.literal('')).nullable(),
  stage: applicationStageSchema,
  status: z.string().or(z.literal('')).nullable(),
  description: z
    .string()
    .max(8000, 'Reached maximum description character limit')
    .or(z.literal(''))
    .nullable(),

  spottedAt: z.date(),
  appliedAt: z.date().nullable(),
  inFlightAt: z.date().nullable(),
  interviewAt: z.date().nullable(),
  offerAt: z.date().nullable(),
  landedAt: z.date().nullable(),
  rejectedAt: z.date().nullable(),
  withdrawnAt: z.date().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const newApplicationSchema = applicationSchema.pick({
  company: true,
  role: true,
  description: true,
  stage: true,
})

export const quickApplicationSchema = applicationSchema.pick({
  company: true,
  role: true,
})

export const updateApplicationSchema = applicationSchema.omit({
  appliedAt: true,
  updatedAt: true,
  inFlightAt: true,
  interviewAt: true,
  offerAt: true,
})

export const deleteApplicationSchema = applicationSchema.pick({
  id: true,
})

export const getApplicationSchema = applicationSchema.pick({
  id: true,
})

export const updateApplicationStageSchema = applicationSchema.pick({
  id: true,
  stage: true,
})

export const applicationWithDocStatusSchema = applicationSchema.and(
  z.object({
    hasDocuments: z.boolean(),
  }),
)
