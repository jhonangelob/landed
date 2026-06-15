import { randomInt } from 'node:crypto'

import { desc, eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { subscriptionCodes, users } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import { BUSINESS_DURATION_DAYS, PREMIUM_DURATION_DAYS } from '#/config'

import { createCodesSchema } from '#/validators/admin'
import type { CodePlanId } from '#/validators/admin'

export interface SubscriptionCodeRow {
  id: string
  code: string
  planId: 'economy' | 'premium' | 'business'
  durationDays: number
  redeemedBy: string | null
  redeemerEmail: string | null
  redeemedAt: Date | null
  createdAt: Date
}

const PLAN_DURATION: Record<CodePlanId, number> = {
  premium: PREMIUM_DURATION_DAYS,
  business: BUSINESS_DURATION_DAYS,
}

// Crockford-style alphabet, no ambiguous characters (0/O, 1/I/L).
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let out = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += '-'
    out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  }
  return out
}

async function ensureAdminSession() {
  const session = await ensureSession()
  if (session.user.role !== 'admin')
    throw new AppError('UNAUTHORIZED', 'Admin access required')
  return session
}

export const getSubscriptionCodes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SubscriptionCodeRow[]> => {
    await ensureAdminSession()

    return db
      .select({
        id: subscriptionCodes.id,
        code: subscriptionCodes.code,
        planId: subscriptionCodes.planId,
        durationDays: subscriptionCodes.durationDays,
        redeemedBy: subscriptionCodes.redeemedBy,
        redeemerEmail: users.email,
        redeemedAt: subscriptionCodes.redeemedAt,
        createdAt: subscriptionCodes.createdAt,
      })
      .from(subscriptionCodes)
      .leftJoin(users, eq(users.id, subscriptionCodes.redeemedBy))
      .orderBy(desc(subscriptionCodes.createdAt))
      .limit(100)
  },
)

export const createSubscriptionCodes = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createCodesSchema.parse(data))
  .handler(async ({ data }): Promise<{ code: string }[]> => {
    const session = await ensureAdminSession()

    const codes = new Set<string>()
    while (codes.size < data.quantity) codes.add(generateCode())

    const rows = await db
      .insert(subscriptionCodes)
      .values(
        [...codes].map((code) => ({
          code,
          planId: data.planId,
          durationDays: PLAN_DURATION[data.planId],
          createdBy: session.user.id,
        })),
      )
      .onConflictDoNothing({ target: subscriptionCodes.code })
      .returning({ code: subscriptionCodes.code })

    return rows
  })
