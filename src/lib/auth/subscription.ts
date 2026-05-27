import { db } from '#/lib/db'
import { subscriptions } from '#/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserPlan(userId: string): Promise<'free' | 'runway'> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  if (!result.length) return 'free'

  const sub = result[0]

  if (sub.expiresAt && new Date() > sub.expiresAt) return 'free'

  return sub.planId as 'free' | 'runway'
}
