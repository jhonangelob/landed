import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { users } from '#/lib/db/schema'

import { updateAccountSchema } from '#/validators/account'

export const getAccountDetails = createServerFn({ method: 'GET' }).handler(
  async (): Promise<any | null> => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

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
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

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
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    await db.delete(users).where(eq(users.id, session.user.id))

    return { success: true }
  },
)
