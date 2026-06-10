import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { db } from '#/lib/db/index.server'
import { touchdownShares, users } from '#/lib/db/schema'

import { ensureSession } from './session'

export const statsSnapshotSchema = z.object({
  company: z.string(),
  role: z.string(),
  planTier: z.string(),
  previousCompany: z.string().optional(),
  previousRole: z.string().optional(),
  appliedAt: z.string().nullable(),
  landedAt: z.string(),
  compensation: z.string().optional(),
  location: z.string().optional(),
  appliedCount: z.number(),
  interviewedCount: z.number(),
  daysCount: z.number(),
})

export type StatsSnapshot = z.infer<typeof statsSnapshotSchema>

export const createTouchdownShare = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        applicationId: z.string().uuid(),
        statsSnapshot: statsSnapshotSchema,
      })
      .parse(data),
  )
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
  .inputValidator((data: unknown) =>
    z.object({ shareToken: z.string() }).parse(data),
  )
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
  .inputValidator((data: unknown) =>
    z.object({ applicationId: z.string().uuid() }).parse(data),
  )
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
