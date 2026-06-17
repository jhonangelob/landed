import { Resend } from 'resend'

import { AppError } from '../utils'

if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
  throw new AppError(
    'MISSING_ENV',
    'API Key is not defined in the environment variables',
  )
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
