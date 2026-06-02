import type React from 'react'

interface SectionCardProps {
  subTitle: string
  order: number
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export default function SectionCard({
  subTitle,
  order,
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg border bg-white p-6 shadow-none ${className}`}
    >
      <div className="mb-3.5 flex flex-row items-start justify-between gap-4">
        <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          {subTitle}
        </p>
        <div className="flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-[1.4] tracking-[1.5px] text-ink-muted">
          0{order}
        </div>
      </div>
      <p className="font-display mb-5 text-[22px] leading-[1.4] font-bold tracking-[-0.6px] text-ink-strong">
        {title}
      </p>
      <p className="text-muted mb-4.5 font-sans text-[14px] leading-normal font-normal">
        {description}
      </p>
      {children}
    </div>
  )
}
