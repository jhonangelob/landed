import { eq } from 'drizzle-orm'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'

export async function getUserPlan(
  userId: string,
): Promise<'economy' | 'premium' | 'business'> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  if (!result.length) return 'economy'

  const sub = result[0]

  if (!sub.isActive) return 'economy'

  if (sub.expiresAt && new Date() > sub.expiresAt) return 'economy'

  return sub.planId
}
