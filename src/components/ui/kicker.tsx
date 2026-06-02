import * as React from 'react'

import { cn } from '#/lib/utils.ts'

/**
 * Mono-uppercase "eyebrow" label used across panels, modals, and cards
 * (e.g. "Cabin upgrade · Subscription", "Bay 01 · Account").
 *
 * Defaults match the most common usage; size, tracking, and color can be
 * overridden via `className` (tailwind-merge keeps the last value):
 *   <Kicker className="text-[9px] tracking-[1.3px] text-primary">…</Kicker>
 */
function Kicker({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="kicker"
      className={cn(
        'text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase',
        className,
      )}
      {...props}
    />
  )
}

export { Kicker }
