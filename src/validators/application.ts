import z from 'zod'

import { applicationStageSchema } from './shared'

export const applicationSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
  location: z.string().or(z.literal('')),
  salaryRange: z.string().or(z.literal('')),
  notes: z.string().or(z.literal('')),
  stage: applicationStageSchema,
  status: z.string().or(z.literal('')),
  description: z
    .string()
    .max(50_000, 'Reached maximum description character limit')
    .or(z.literal('')),
  appliedAt: z.date().nullable(),
  updatedAt: z.date(),
  interviewAt: z.date(),
  offerAt: z.date(),
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
