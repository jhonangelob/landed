import { toast as sonner } from 'sonner'

import { ToastCard } from '#/components/ui/sonner'
import type { ToastType } from '#/components/ui/sonner'

import { formatResetDate } from '#/helper/usage'

import { parseError } from './error'

const DEFAULT_DURATION = 4000

interface ShowOptions {
  /** Reuse an existing toast id (e.g. to resolve a loading toast in place). */
  id?: string | number
  duration?: number
}

/** Render a custom toast card. `header` is the title, `message` the detail. */
function show(
  type: ToastType,
  header: string,
  message?: string,
  options?: ShowOptions,
) {
  const duration =
    options?.duration ?? (type === 'loading' ? Infinity : DEFAULT_DURATION)

  return sonner.custom(
    (id) => (
      <ToastCard
        id={id}
        type={type}
        header={header}
        message={message}
        duration={duration === Infinity ? DEFAULT_DURATION : duration}
      />
    ),
    // Only set `id` when we actually have one. sonner.custom spreads this
    // object *after* its generated id (`{ ...id, ...data }`), so passing
    // `id: undefined` clobbers the real id back to undefined — sonner then
    // mints a different id for the toast than the one it hands to the render
    // fn, and dismiss()/the close button can never match it.
    options?.id !== undefined ? { id: options.id, duration } : { duration },
  )
}

/**
 * Thin semantic wrapper over sonner so call sites stay declarative
 * (`notify.generationDone(...)`) instead of repeating titles, icons and
 * descriptions everywhere.
 */
export const notify = {
  success(message: string, description?: string) {
    return show('success', message, description)
  },

  info(message: string, description?: string) {
    return show('info', message, description)
  },

  warning(message: string, description?: string) {
    return show('warning', message, description)
  },

  error(message: string, description?: string) {
    return show('error', message, description)
  },

  loading(message: string, description?: string) {
    return show('loading', message, description)
  },

  /** Turn any thrown/server error into a friendly error toast. */
  fromError(error: unknown, fallback = 'Something went wrong') {
    const { message } = parseError(error)
    return show('error', fallback, message !== fallback ? message : undefined)
  },

  /**
   * Gentle nudge when a free-plan pilot is running low on generations.
   * Surfaces the remaining count and when the allowance resets.
   */
  headsUp(remaining: number, resetAt: Date | string | null) {
    return show(
      'warning',
      remaining <= 0
        ? 'You are out of generations'
        : `${remaining} generation${remaining === 1 ? '' : 's'} left`,
      `Your allowance resets on ${formatResetDate(resetAt)}.`,
    )
  },

  /** Co-Pilot finished tailoring documents for a role. */
  generationDone(role?: string, company?: string) {
    const target = [role, company && `@ ${company}`].filter(Boolean).join(' ')
    return show(
      'success',
      target
        ? `Tailored CV for ${target} is ready`
        : 'Your documents are ready',
      'Your CV and cover letter have finished generating.',
    )
  },

  /** A pending toast that resolves to success/error — handy for async flows. */
  promise<T>(
    promise: Promise<T>,
    opts: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
  ) {
    const id = show('loading', opts.loading)
    promise.then(
      (data) =>
        show(
          'success',
          typeof opts.success === 'function' ? opts.success(data) : opts.success,
          undefined,
          { id },
        ),
      (error) =>
        show(
          'error',
          typeof opts.error === 'function' ? opts.error(error) : opts.error,
          undefined,
          { id },
        ),
    )
    return promise
  },

  dismiss(id?: string | number) {
    return sonner.dismiss(id)
  },
}
