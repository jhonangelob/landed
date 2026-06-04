import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '#/lib/db/index.server'
import { accounts, sessions, users, verifications } from '#/lib/db/schema'

import { FROM_EMAIL, resend } from '../email/index.server'
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: `Landed <${FROM_EMAIL}>`,
        to: user.email,
        subject: 'Reset your Landed password',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
            <h1 style="font-size:22px;font-weight:700;color:#0c1f35;margin-bottom:8px;">
              Reset your password
            </h1>
            <p style="color:#5a7a99;font-size:15px;margin-bottom:24px;">
              We received a request to reset your Landed password.
              This link expires in 1 hour.
            </p>
            <a
              href="${url}"
              style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;"
            >
              Reset password →
            </a>
            <p style="margin-top:24px;font-size:12px;color:#5a7a99;">
              If you didn't request this, ignore this email.
            </p>
          </div>
        `,
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url }) => {
      void resend.emails.send({
        from: `Landed <${FROM_EMAIL}>`,
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
            <h1 style="font-size:22px;font-weight:700;color:#0c1f35;margin-bottom:8px;">
              Verify Email
            </h1>
            <p style="color:#5a7a99;font-size:15px;margin-bottom:24px;">
              We received a request to verify your Landed account.
              This link expires in 1 hour.
            </p>
            <a
              href="${url}"
              style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;"
            >
              Verify Email →
            </a>
            <p style="margin-top:24px;font-size:12px;color:#5a7a99;">
              If you didn't request this, ignore this email.
            </p>
          </div>
        `,
      })
    },
  },

  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        unique: true,
      },
      hasOnboarded: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'seeker',
        input: false,
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
