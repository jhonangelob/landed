import * as React from 'react'

import { cn } from '#/lib/utils.ts'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 bg-surface-subtle flex min-h-16 w-full rounded-lg border px-3 py-2 text-[13px] shadow-none transition-[color,box-shadow] outline-none focus:border-[#2ea5f5] disabled:cursor-not-allowed disabled:opacity-50 md:text-[14px]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
