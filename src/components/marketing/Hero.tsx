import { PlayIcon, PlusIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'

export default function Hero() {
  return (
    <div className="px-14 pt-26 pb-19">
      <div className="mx-auto grid max-w-295 grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.8px] uppercase">
            Your job search, navigated with AI.
          </p>
          <p className="font-display text-ink-strong text-[68px] leading-[1.02] font-bold tracking-[-1.7px]">
            Land the job
            <br /> — with the
            <br /> whole search <br />
            <span className="text-primary italic">under control.</span>
          </p>
          <p className="text-ink-muted font-sans text-[19px] leading-[1.6]">
            Landed gives every application a place to live, an AI Co-Pilot that
            tailors your CV and cover letter to each role, and a clear read on
            what’s next — so nothing stalls on the tarmac.
          </p>
          <div className="flex flex-row items-center gap-4">
            <Button className="b h-12.5! px-6! font-sans text-[15px] leading-[1.4] font-semibold">
              <PlusIcon />
              Start tracking - free
            </Button>
            <Button
              className="h-12.5! px-6! font-sans text-[15px] leading-[1.4] font-semibold"
              variant="outline"
            >
              <PlayIcon className="fill-primary stroke-primary size-3 rounded-none" />
              See how it works
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
