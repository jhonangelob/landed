import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { Button } from '../ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 border border-red-400">
      <img src="/assets/airplane_crash.svg" alt="" className="h-140 w-auto" />
      <p className="font-display text-primary-text text-[44px] leading-[1.02] font-bold tracking-[-1.7px] uppercase">
        404 - Altitude lost
      </p>
      <p className="text-ink-muted text-center font-sans text-[17px] leading-[1.6]">
        It looks like you've drifted off the flight plan. The page you're
        looking for doesn't exist
        <br /> or has been relocated within the fleet.
      </p>
      <div className="mt-12 flex flex-row items-center gap-4">
        <Button
          variant="outline"
          asChild
          className="text-primary-text! h-12 w-60 font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
        >
          <Link to="/app">
            <MoveLeftIcon />
            Return to Previous Page
          </Link>
        </Button>
        <Button
          asChild
          className="h-12 w-60 font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] text-white! uppercase"
        >
          <Link to="/app">
            Back to Flight Deck <MoveRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  )
}
