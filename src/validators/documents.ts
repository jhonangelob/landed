import z from 'zod'

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
  address: string
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

export interface CvContent {
  headline: string
  summary: string
  experience: Experience[]
  contact?: Contact
  skills: string[]
  education: Education[]
  leadership?: Leadership[]
  skillGroups?: SkillGroup[]
}

export interface CoverLetterContent {
  opening: string
  body: string
  closing: string
}

const cvContentSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      dates: z.string(),
      bullets: z.array(z.string()),
      location: z.string().optional(),
    }),
  ),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
      location: z.string().optional(),
      detail: z.string().optional(),
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
