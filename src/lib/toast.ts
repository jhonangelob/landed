import { formatResetDate } from '#/helper/usage'
import { toast as sonner } from 'sonner'

import { parseError } from './error'

/**
 * Thin semantic wrapper over sonner so call sites stay declarative
 * (`notify.generationDone(...)`) instead of repeating titles, icons and
 * descriptions everywhere.
 */
export const notify = {
  success(message: string, description?: string) {
    return sonner.success(message, { description })
  },

  info(message: string, description?: string) {
    return sonner.info(message, { description })
  },

  error(message: string, description?: string) {
    return sonner.error(message, { description })
  },

  /** Turn any thrown/server error into a friendly error toast. */
  fromError(error: unknown, fallback = 'Something went wrong') {
    const { message } = parseError(error)
    return sonner.error(fallback, {
      description: message !== fallback ? message : undefined,
    })
  },

  /**
   * Gentle nudge when a free-plan pilot is running low on generations.
   * Surfaces the remaining count and when the allowance resets.
   */
  headsUp(remaining: number, resetAt: Date | string | null) {
    return sonner.warning(
      remaining <= 0
        ? 'You are out of generations'
        : `${remaining} generation${remaining === 1 ? '' : 's'} left`,
      {
        description: `Your allowance resets on ${formatResetDate(resetAt)}.`,
      },
    )
  },

  /** Co-Pilot finished tailoring documents for a role. */
  generationDone(role?: string, company?: string) {
    const target = [role, company && `@ ${company}`].filter(Boolean).join(' ')
    return sonner.success(
      target
        ? `Tailored CV for ${target} is ready`
        : 'Your documents are ready',
      { description: 'Your CV and cover letter have finished generating.' },
    )
  },

  /** A pending toast that resolves to success/error — handy for async flows. */
  promise: sonner.promise,

  loading(message: string) {
    return sonner.loading(message)
  },

  dismiss(id?: string | number) {
    return sonner.dismiss(id)
  },
}
