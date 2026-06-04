import z from 'zod'

export const documentsByApplicationSchema = z.object({
  id: z.string().uuid(),
})

export const generateDocumentSchema = z.object({
  applicationId: z.string().uuid(),
})

export const exportDocumentSchema = z.object({
  applicationId: z.string().uuid(),
  template: z.enum(['classic', 'modern', 'minimal']).default('classic'),
})

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>
export type ExportDocumentInput = z.infer<typeof exportDocumentSchema>

export type Document = {
  id: string
  userId: string
  applicationId: string
  type: 'cv' | 'cover_letter'
  contentJson: CvContent | CoverLetterContent
  contentHtml: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  location: string
  email: string
  phone: string
}

export interface Experience {
  company: string
  role: string
  dates: string
  bullets: string[]
  location?: string
}

export interface Education {
  institution: string
  degree: string
  year: string
  location?: string
  detail?: string
}

export interface Leadership {
  organization: string
  role?: string
  location?: string
  dates?: string
  bullets?: string[]
}

export interface SkillGroup {
  label: string
  value: string
}

export interface Certification {
  name: string
  issuer: string
  date?: string
}

export interface Links {
  github?: string
  linkedin?: string
  portfolio?: string
}

export interface CvContent {
  name: string
  contact: Contact
  headline: string
  summary: string
  experience: Experience[]
  skills: string[]
  education: Education[]
  leadership?: Leadership[]
  skillGroups?: SkillGroup[]
  certifications?: Certification[]
  links?: Links
}

export interface CoverLetterContent {
  opening: string
  body: string
  closing: string
}

const optionalString = z
  .string()
  .nullish()
  .transform((v) => v ?? undefined)

const cvContentSchema = z.object({
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
  links: z
    .object({
      github: optionalString,
      linkedin: optionalString,
      portfolio: optionalString,
    })
    .optional(),
})

const coverLetterSchema = z.object({
  opening: z.string().min(1),
  body: z.string().min(1),
  closing: z.string().min(1),
})

export const aiResponseSchema = z.object({
  cv: cvContentSchema,
  coverLetter: coverLetterSchema,
})
