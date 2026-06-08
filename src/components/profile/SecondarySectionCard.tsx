import type React from 'react'

interface SecondarySectionCardProps {
  title: string
  subTitle?: string
  icon: React.ReactNode
  children: React.ReactNode
}

export default function SecondarySectionCard({
  title,
  subTitle,
  icon,
  children,
}: SecondarySectionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
      <div className="flex flex-row items-center justify-between">
        <p className="font-display text-ink-strong flex flex-row items-center gap-3 text-[15px] leading-[1.4] font-bold tracking-[-0.1px]">
          {icon} {title}
        </p>
        <p className="trakcing-[0.9px] text-muted font-mono text-[10px] leading-[1.4] uppercase">
          {subTitle}
        </p>
      </div>
      {children}
    </div>
  )
}
