import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { AppError } from '../utils'
import * as schema from './schema'

if (!process.env.NEON_DATABASE_URL) {
  throw new AppError(
    'MISSING_ENV',
    'API Key is not defined in the environment variables',
  )
}

const sql = neon(process.env.NEON_DATABASE_URL)

export const db = drizzle(sql, { schema })

export type DB = typeof db
