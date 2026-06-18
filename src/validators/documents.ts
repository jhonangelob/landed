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

export const exportCoverLetterSchema = z.object({
  applicationId: z.string().uuid(),
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

/**
 * What the model returns for a cover letter. The recipient block is extracted
 * from the job posting (and may be entirely absent); the sender, date and
 * company are filled in server-side from authoritative data, never the model.
 */
export const coverLetterAiSchema = z.object({
  recipient: z
    .object({
      name: optionalString,
      title: optionalString,
      address: optionalString,
    })
    .nullish()
    .transform((v) => v ?? undefined),
  greeting: z.string().min(1),
  opening: z.string().min(1),
  body: z.string().min(1),
  closing: z.string().min(1),
})

/** Full stored cover letter, including the business-letter header block. */
export const coverLetterSchema = z.object({
  sender: z.object({
    name: z.string(),
    location: optionalString,
    phone: optionalString,
    email: optionalString,
  }),
  date: z.string(),
  recipient: z.object({
    name: optionalString,
    title: optionalString,
    company: z.string(),
    address: optionalString,
  }),
  greeting: z.string().min(1),
  opening: z.string().min(1),
  body: z.string().min(1),
  closing: z.string().min(1),
})

export const parseFileSchema = z.object({
  fileContent: z
    .string()
    .min(1, 'File is empty')
    .max(8_000_000, 'File is too large (max ~6MB)'),
  fileType: z.enum(['pdf', 'docx']),
})
