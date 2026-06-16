import {
  CheckIcon,
  CircleAlertIcon,
  CircleXIcon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { ToasterProps } from 'sonner'
import { Toaster as Sonner, toast as sonnerToast } from 'sonner'

import { cn } from '#/lib/utils'

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

/** Optional call-to-action rendered as a button inside the toast. */
export interface ToastAction {
  label: string
  onClick: () => void
}

const TYPE_CONFIG: Record<
  ToastType,
  { label: string; accent: string; Icon: LucideIcon }
> = {
  success: { label: 'Cleared', accent: '#10b981', Icon: CheckIcon },
  info: { label: 'Update', accent: 'var(--primary-blue)', Icon: InfoIcon },
  warning: { label: 'Heads up', accent: '#f59e0b', Icon: CircleAlertIcon },
  error: { label: 'Error', accent: 'var(--destructive)', Icon: CircleXIcon },
  loading: {
    label: 'Working',
    accent: 'var(--foreground-soft2)',
    Icon: Loader2Icon,
  },
}

export interface ToastCardProps {
  id: string | number
  type: ToastType
  /** Dynamic title shown in the body, next to the icon — sonner's "message". */
  header: string
  /** Secondary line shown under the title — sonner's "description". */
  message?: string
  /** Auto-dismiss lifetime in ms (used to time the progress bar). */
  duration: number
  /** Optional action button shown in the body row. */
  action?: ToastAction
}

export function ToastCard({
  id,
  type,
  header,
  message,
  duration,
  action,
}: ToastCardProps) {
  const { accent, Icon, label } = TYPE_CONFIG[type]
  const isLoading = type === 'loading'

  return (
    <div
      style={{ '--toast-accent': accent } as React.CSSProperties}
      className="bg-popover border-border relative w-(--width) max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border px-3.5 pt-3 pb-3.5"
    >
      {/* Top row — status dot, fixed header and close button on one line */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'size-2 shrink-0 rounded-full bg-(--toast-accent)',
            isLoading && 'animate-pulse',
          )}
        />
        <span className="text-muted flex-1 font-mono text-[11px] leading-[1.4] font-medium tracking-[0.4px]">
          {label}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={() => sonnerToast.dismiss(id)}
          className="text-muted-foreground hover:bg-secondary flex size-4.5 shrink-0 items-center justify-center rounded opacity-60 hover:opacity-100"
        >
          {/* Keep the <button> as the event target (not the SVG) so a stray
              drag on the icon can't kick sonner into a swipe gesture. */}
          <XIcon className="pointer-events-none size-3.5" />
        </button>
      </div>

      {/* Body — type icon next to the dynamic title and message */}
      <div className="mt-2.5 flex items-center gap-2.5">
        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-md bg-(--toast-accent)/10">
          <Icon
            className={cn(
              'size-4 shrink-0 text-(--toast-accent)',
              isLoading && 'animate-spin',
            )}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-popover-foreground text-[13px] leading-4.5 font-semibold">
            {header}
          </p>
          {message ? (
            <p className="text-muted-foreground text-[12px] leading-normal">
              {message}
            </p>
          ) : null}
        </div>

        {action ? (
          <button
            type="button"
            onClick={() => {
              action.onClick()
              sonnerToast.dismiss(id)
            }}
            className="border-border bg-secondary text-popover-foreground hover:bg-secondary/80 ml-auto shrink-0 rounded-md border px-2.5 py-1 text-[12px] font-medium"
          >
            {action.label}
          </button>
        ) : null}
      </div>

      {/* Progress bar pinned to the bottom edge */}
      <span
        aria-hidden
        className={cn(
          'toast-progress-bar absolute bottom-0 left-0 h-0.75 origin-left bg-(--toast-accent)',
          isLoading ? 'toast-progress-bar--loading w-[35%]' : 'w-full',
        )}
        style={isLoading ? undefined : { animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

const Toaster = (props: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
