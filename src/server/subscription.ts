import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { subscriptions } from '#/lib/db/schema'

export const checkGenerationLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)
      .then((r) => r[0] ?? null)

    const used = sub.generationsUsed
    const limit = sub.generationsLimit

    return {
      used,
      limit,
      remaining: limit - used,
      hasReached: used >= limit,
    }
  },
)
