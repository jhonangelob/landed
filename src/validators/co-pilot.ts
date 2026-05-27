import z from 'zod'

export const generateDocumentSchema = z.object({
  applicationId: z.string(),
})

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>
