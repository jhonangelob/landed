import { count, eq, max, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { applications, generatedDocs } from '#/lib/db/schema'

export const getActivities = createServerFn({
  method: 'GET',
}).handler(
  async (): Promise<{
    applicationCount: number
    activeInterviewCount: number
    documentCount: number
    lastDocGenerated: Date | null
  }> => {
    const session = await ensureSession()

    const uid = session.user.id

    const [[appStats], [docStats]] = await Promise.all([
      db
        .select({
          total: count(),
          // count(expr) counts non-null rows, and a boolean predicate is never
          // null — so a conditional FILTER is required to count only interviews.
          activeInterviews: sql<number>`
            count(*) filter (
              where ${applications.stage} = 'interview'
              and ${applications.deletedAt} is null
            )
          `.mapWith(Number),
        })
        .from(applications)
        .where(eq(applications.userId, uid)),

      db
        .select({
          total: count(),
          lastGenerated: max(generatedDocs.createdAt),
        })
        .from(generatedDocs)
        .where(eq(generatedDocs.userId, uid)),
    ])

    return {
      applicationCount: appStats.total,
      activeInterviewCount: appStats.activeInterviews,
      documentCount: docStats.total,
      lastDocGenerated: docStats.lastGenerated,
    }
  },
)
