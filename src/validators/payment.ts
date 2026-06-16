import { z } from 'zod'

export const verifyIntentSchema = z.object({
  intentId: z.string(),
})
