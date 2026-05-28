import { eq } from 'drizzle-orm'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'

export async function getUserPlan(
  userId: string,
): Promise<'free' | 'runway' | 'runway_3mo'> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  if (!result.length) return 'free'

  const sub = result[0]

  if (sub.expiresAt && new Date() > sub.expiresAt) return 'free'

  return sub.planId
}
