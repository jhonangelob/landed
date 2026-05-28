import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { users } from '#/lib/db/schema'

import { updateAccountSchema } from '#/validators/account'

export const getAccountDetails = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    return result[0] ?? null
  },
)

export const updateAccountDetails = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateAccountSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await db
      .update(users)
      .set({
        name: data.fullName,
        updatedAt: new Date(),
        username: data.username,
      })
      .where(eq(users.id, session.user.id))

    return { success: true }
  })

export const deleteAccount = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await ensureSession()

    await db.delete(users).where(eq(users.id, session.user.id))

    return { success: true }
  },
)
