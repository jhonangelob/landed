import { PlayIcon, PlusIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export default function Hero() {
  return (
    <div className="px-4 py-12 md:px-16 md:py-29">
      <div className="mx-auto grid max-w-295 grid-cols-1 gap-8 md:grid-cols-2 md:gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.8px] uppercase">
            Your job search, navigated with AI.
          </p>
          <p className="font-display text-ink-strong text-[40px] leading-[1.05] font-bold tracking-[-1px] md:text-[68px] md:leading-[1.02] md:tracking-[-1.7px]">
            Land the job
            <br /> — with the
            <br /> whole search <br />
            <span className="text-primary italic">under control.</span>
          </p>
          <p className="text-ink-muted font-sans text-[17px] leading-[1.6] md:text-[19px]">
            Landed gives every application a place to live, an AI Co-Pilot that
            tailors your CV and cover letter to each role, and a clear read on
            what’s next — so nothing stalls on the tarmac.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild>
              <Link
                to="/signup"
                className="h-12.5! w-full justify-center px-6! font-sans text-[15px] leading-[1.4] font-semibold text-white! sm:w-auto"
              >
                <PlusIcon />
                Start tracking - free
              </Link>
            </Button>

            <Button
              className="h-12.5! w-full justify-center px-6! font-sans text-[15px] leading-[1.4] font-semibold sm:w-auto"
              variant="outline"
            >
              <a
                href="#how-it-works"
                className="flex flex-row items-center gap-2"
              >
                <PlayIcon className="fill-primary stroke-primary size-3 rounded-none" />
                See how it works
              </a>
            </Button>
          </div>
          <p className="text-muted font-mono text-[12px] leading-[1.4] tracking-[0.5px]">
            Free forever plan - No card required - Your data stays yours
          </p>
        </div>
        <div>image</div>
      </div>
    </div>
  )
}
