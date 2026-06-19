import { MoveRightIcon, PlusIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'

export default function CallToAction() {
  return (
    <div className="bg-surface-muted min-w-full p-4 md:p-14">
      <div className="bg-ink-strong mx-auto flex max-w-6xl flex-col items-center gap-2 rounded-xl p-8 text-center md:p-18">
        <p className="font-mono text-[11px] leading-[1.4] tracking-[1.3px] text-[#b2dbff] uppercase">
          Cleared for Takeoff
        </p>
        <p className="font-display text-[30px] leading-[1.1] font-bold tracking-[-0.8px] text-white md:text-[50px] md:leading-[1.05] md:tracking-[-1.3px]">
          Ready to <span className="text-primary italic">land</span> the next
          one?
        </p>
        <p className="font-sans text-[16px] leading-[1.4] font-normal text-[#c3c7cd]">
          Start free, track every application, and let Co-Pilot do the writing.
          No
          <br /> card, no auto-renewal. Just your search, finally under control.
        </p>
        <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Link
            to="/signup"
            className="bg-primary hover:bg-primary/80 flex flex-row items-center justify-center gap-2 rounded-lg px-5.5 py-3.5 font-sans text-[15px] leading-[1.4] font-semibold text-white!"
          >
            <PlusIcon />
            Start tracking - free
          </Link>

          <a
            href="#pricing"
            className="border-muted text-primary flex flex-row items-center justify-center gap-2 rounded-lg border px-5.5 py-3.5 font-sans text-[15px] leading-[1.4] font-semibold hover:bg-white/10"
          >
            Compare cabins <MoveRightIcon className="size-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
