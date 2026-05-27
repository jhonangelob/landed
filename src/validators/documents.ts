import z from 'zod'

export const generateDocumentSchema = z.object({
  applicationId: z.string(),
})

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>

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
