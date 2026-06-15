import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from '#/lib/auth'

import { AppError } from '../utils'

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL

if (!baseURL) {
  throw new AppError(
    'MISSING_ENV',
    'VITE_BETTER_AUTH_URL is not set in the .env file',
  )
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  changePassword,
  deleteUser,
  requestPasswordReset,
  resetPassword,
} = authClient
