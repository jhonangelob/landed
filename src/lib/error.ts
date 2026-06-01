import type { ErrorCode } from './utils'

export type ParsedErrorCode = ErrorCode | 'UNKNOWN'

export interface ParsedError {
  code: ParsedErrorCode
  message: string
}

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

export function parseError(error: unknown): ParsedError {
  if (error && typeof error === 'object') {
    const e = error as { code?: unknown; message?: unknown }
    const message =
      typeof e.message === 'string' && e.message.trim()
        ? e.message
        : DEFAULT_MESSAGE

    if (typeof e.code === 'string') {
      return { code: e.code as ParsedErrorCode, message }
    }

    if (
      /limit reached|generation limit|used all of your generations|out of generations/i.test(
        message,
      )
    ) {
      return { code: 'GENERATION_LIMIT_REACHED', message }
    }
    if (/30 minutes|rate limit/i.test(message)) {
      return { code: 'RATE_LIMIT_EXCEEDED', message }
    }
    if (/unauthor|logged in/i.test(message)) {
      return { code: 'UNAUTHORIZED', message }
    }

    return { code: 'UNKNOWN', message }
  }

  if (typeof error === 'string' && error.trim()) {
    return { code: 'UNKNOWN', message: error }
  }

  return { code: 'UNKNOWN', message: DEFAULT_MESSAGE }
}

export function isUsageLimitError(error: unknown): boolean {
  return parseError(error).code === 'GENERATION_LIMIT_REACHED'
}
