import type React from 'react'

import { cn } from '#/lib/utils'

interface SectionCardProps {
  title: string
  subTitle: string
  children: React.ReactNode
  variant?: 'default' | 'destructive'
}

export default function SectionCard({
  title,
  subTitle,
  children,
  variant = 'default',
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border p-6 shadow-none',
        variant === 'destructive'
          ? 'border-destructive bg-[#fef4f4]'
          : 'bg-white',
      )}
    >
      <div className="mb-4 flex flex-row items-start justify-between gap-4 border-b pb-2">
        <p
          className={cn(
            'font-display text-[17px] leading-[1.4] font-bold tracking-[-0.4px]',
            variant === 'destructive'
              ? 'text-destructive'
              : 'text-primary-text',
          )}
        >
          {title}
        </p>
        <p className="text-muted rounded-md border px-2 py-0.5 font-mono text-[10px] leading-[1.4] font-normal tracking-[1.4px] uppercase">
          {subTitle}
        </p>
      </div>
      {children}
    </div>
  )
}
