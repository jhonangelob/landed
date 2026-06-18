import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '#/lib/auth'

const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : import.meta.env.VITE_BETTER_AUTH_URL

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
