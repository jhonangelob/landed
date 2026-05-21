import z from 'zod'

export const generateDocumentSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
})
