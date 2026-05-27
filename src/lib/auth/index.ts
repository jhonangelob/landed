import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '#/lib/db'
import { accounts, sessions, users, verifications } from '#/lib/db/schema'

if (!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL)
  throw new Error('API Key is not defined in the environment variables')

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  requireEmailVerification: true,

  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        unique: true,
      },
    },
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [tanstackStartCookies()],
})
