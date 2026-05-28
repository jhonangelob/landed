import { createAuthClient } from 'better-auth/client'

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
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  changePassword,
  deleteUser,
} = authClient
