import z from 'zod'

export const generateDocumentSchema = z.object({
  applicationId: z.string(),
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
