import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

import { AppError } from '#/lib/utils'

config({ path: ['.env.local', '.env'] })

if (!process.env.NEON_DATABASE_URL) {
  throw new AppError(
    'MISSING_ENV',
    'NEON_DATABASE_URL is not set in the .env file',
  )
}

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL,
  },
})
