import { db } from '#/lib/db/index.server'
import { aiUsage } from '#/lib/db/schema'

interface UsageLike {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}

/**
 * Records token usage for a single Claude API call. Best-effort: analytics must
 * never break document generation, so failures are swallowed and logged.
 */
export async function recordAiUsage(params: {
  userId: string
  model: string
  kind: 'cv' | 'cover_letter' | 'profile_parse'
  usage?: UsageLike
}): Promise<void> {
  try {
    const inputTokens = params.usage?.inputTokens ?? 0
    const outputTokens = params.usage?.outputTokens ?? 0
    const totalTokens = params.usage?.totalTokens ?? inputTokens + outputTokens

    await db.insert(aiUsage).values({
      userId: params.userId,
      model: params.model,
      kind: params.kind,
      inputTokens,
      outputTokens,
      totalTokens,
    })
  } catch (err) {
    console.error('Failed to record AI usage', err)
  }
}
