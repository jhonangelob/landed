import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { users } from '#/lib/db/schema'
import { updateAccountSchema } from '#/validators/account'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

export const getAccountDetails = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    return await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
  },
)

export const updateAccountDetails = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateAccountSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    await db
      .update(users)
      .set({ name: data.fullName, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))

    return { success: true }
  })
