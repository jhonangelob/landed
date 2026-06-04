import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'AI_PARSE_ERROR'
  | 'AI_VALIDATION_ERROR'
  | 'GENERATION_LIMIT_REACHED'
  | 'APPLICATION_LIMIT_REACHED'
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'TEMPLATE_LOCKED'
  | 'DOCUMENT_NOT_FOUND'
  | 'MISSING_ENV'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_EXCEEDED'

export class AppError extends Error {
  code: ErrorCode
  message: string

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.message = message
  }
}
