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
    .then((r) => r.at(0) ?? null)

  if (!result || !result.isActive) return 'economy'

  if (result.expiresAt && new Date() > result.expiresAt) return 'economy'

  return result.planId
}
