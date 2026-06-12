import z from 'zod'

import { documentTypeSchema, templateSchema } from './shared'

const optionalString = z
  .string()
  .nullish()
  .transform((v) => v ?? undefined)

export const getDocumentSchema = z.object({
  id: z.string().uuid(),
})

export const generateDocumentSchema = z.object({
  applicationId: z.string().uuid(),
  type: documentTypeSchema.optional(),
})

export const exportDocumentSchema = z.object({
  applicationId: z.string().uuid(),
  template: templateSchema,
})

export const cvSchema = z.object({
  name: z.string().min(1),
  contact: z.object({
    location: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  headline: z.string().min(1),
  summary: z.string().min(1),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      dates: z.string(),
      bullets: z.array(z.string()),
      location: optionalString,
    }),
  ),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
      location: optionalString,
      detail: optionalString,
    }),
  ),
  leadership: z
    .array(
      z.object({
        organization: z.string(),
        role: z.string().optional(),
        location: z.string().optional(),
        dates: z.string().optional(),
        bullets: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  skillGroups: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: optionalString,
      }),
    )
    .optional(),
  links: z.array(z.string()),
  optimizationTips: z
    .array(
      z.object({
        category: z.string(),
        tip: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
      }),
    )
    .optional(),
})

export const coverLetterSchema = z.object({
  opening: z.string().min(1),
  body: z.string().min(1),
  closing: z.string().min(1),
})
