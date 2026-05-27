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
  contentJson: Record<string, unknown>
  contentHtml: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  company: string
  role: string
  dates: string
  bullets: string[]
}

export interface Education {
  institution: string
  degree: string
  year: string
}

export interface CvContent {
  headline: string
  summary: string
  experience: Experience[]
  skills: string[]
  education: Education[]
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
    }),
  ),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
    }),
  ),
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
