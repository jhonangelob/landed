import { createAuthClient } from 'better-auth/client'

if (!process.env.BETTER_AUTH_URL)
  throw new Error('API Key is not defined in the environment variables')
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  changePassword,
  deleteUser,
} = authClient
