import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '#/lib/db/index.server'
import { accounts, sessions, users, verifications } from '#/lib/db/schema'

import { AppError } from '../utils'

if (!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL)
  throw new AppError(
    'MISSING_ENV',
    'API Key is not defined in the environment variables',
  )

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
    window: 900,
    max: 5,
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [tanstackStartCookies()],
})
