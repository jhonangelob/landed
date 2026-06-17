import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/lib/auth'
import { AppError } from '#/lib/utils'

export async function ensureSession() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) throw new AppError('UNAUTHORIZED', 'You must be logged in')
  return session
}
