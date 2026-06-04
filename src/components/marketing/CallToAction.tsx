import { MoveRightIcon, PlusIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'

export default function CallToAction() {
  return (
    <div className="bg-surface-muted min-w-full p-14">
      <div className="bg-ink-strong mx-auto flex max-w-6xl flex-col items-center gap-2 rounded-xl p-18">
        <p className="font-mono text-[11px] leading-[1.4] tracking-[1.3px] text-[#b2dbff] uppercase">
          Cleared for Takeoff
        </p>
        <p className="font-display text-[50px] leading-[1.05] font-bold tracking-[-1.3px] text-white">
          Ready to <span className="text-primary italic">land</span> the next
          one?
        </p>
        <p className="font-sans text-[16px] leading-[1.4] font-normal text-[#c3c7cd]">
          Start free, track every application, and let Co-Pilot do the writing.
          No
          <br /> card, no auto-renewal — just your search, finally under
          control.
        </p>
        <div className="mt-6 flex flex-row items-center gap-4">
          <Link
            to="/"
            className="bg-primary hover:bg-primary/80 flex flex-row items-end gap-2 rounded-lg px-5.5 py-3.5 font-sans text-[15px] leading-[1.4] font-semibold text-white!"
          >
            <PlusIcon />
            Start tracking - free
          </Link>

          <Link
            to="/app"
            className="border-muted text-primary flex flex-row items-end gap-2 rounded-lg border px-5.5 py-3.5 font-sans text-[15px] leading-[1.4] font-semibold hover:bg-white/10"
          >
            Compare cabins <MoveRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
