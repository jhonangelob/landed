import { and, eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { db } from '#/lib/db/index.server'
import { touchdownShares, users } from '#/lib/db/schema'

import { ensureSession } from './session'
import {
  getShareTokenSchema,
  getTouchdownShareSchema,
  statsSnapshotSchema,
} from '#/validators/touchdown'

export const createTouchdownShare = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => statsSnapshotSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const existing = await db
      .select({ shareToken: touchdownShares.shareToken })
      .from(touchdownShares)
      .where(
        and(
          eq(touchdownShares.applicationId, data.applicationId),
          eq(touchdownShares.userId, session.user.id),
        ),
      )
      .limit(1)
      .then((r) => r.at(0))

    if (existing) return { shareToken: existing.shareToken }

    const shareToken = crypto.randomUUID()
    await db.insert(touchdownShares).values({
      userId: session.user.id,
      applicationId: data.applicationId,
      statsSnapshot: data.statsSnapshot,
      shareToken,
    })

    return { shareToken }
  })

export const getTouchdownShare = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getTouchdownShareSchema.parse(data))
  .handler(async ({ data }) => {
    return await db
      .select({
        shareToken: touchdownShares.shareToken,
        statsSnapshot: touchdownShares.statsSnapshot,
        createdAt: touchdownShares.createdAt,
        userName: users.name,
      })
      .from(touchdownShares)
      .innerJoin(users, eq(touchdownShares.userId, users.id))
      .where(eq(touchdownShares.shareToken, data.shareToken))
      .limit(1)
      .then((r) => r.at(0) ?? null)
  })

export const getShareTokenForApplication = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getShareTokenSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    return await db
      .select({ shareToken: touchdownShares.shareToken })
      .from(touchdownShares)
      .where(
        and(
          eq(touchdownShares.applicationId, data.applicationId),
          eq(touchdownShares.userId, session.user.id),
        ),
      )
      .limit(1)
      .then((r) => r.at(0)?.shareToken ?? null)
  })
