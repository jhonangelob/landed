import { useState } from 'react'

import { InfoIcon, LogOutIcon, PlusIcon } from 'lucide-react'

import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { signOut } from '#/lib/auth/client'
import { useOnboardingStore } from '#/lib/store/onboarding'
import { cn } from '#/lib/utils'

import { NAVIGATION } from '#/constants/navigations'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import logo from '/landed-logo.svg'

/** Maps app nav URLs to the `data-tour` anchors the onboarding tour points at. */
const TOUR_IDS: Record<string, string> = {
  '/app': 'flight-deck',
  '/app/co-pilot': 'co-pilot',
  '/app/profile': 'profile',
  '/app/hangar': 'hangar',
}

export default function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const openOnboarding = useOnboardingStore((s) => s.open)

  const checkIfSelected = (path: string) => location.pathname === path

  const appLinkClass = (path: string) =>
    cn(
      'border-primary flex h-14 items-center px-4 pt-0.5 font-sans text-[13px] leading-[19.5px] font-semibold text-nowrap',
      checkIfSelected(path)
        ? 'text-primary! border-b-3'
        : 'text-muted-foreground! pb-0.5',
    )

  const handleConfirmLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      navigate({ to: '/login' })
    } finally {
      setLoggingOut(false)
      setLogoutOpen(false)
    }
  }

  const handleNewApplication = () => {
    navigate({ to: '/app/co-pilot' })
  }

  return (
    <header className="fixed top-0 left-0 z-91 w-full max-w-screen border-b bg-white">
      <div className="max-w-8xl mx-auto flex h-14 flex-row items-center justify-between gap-8 px-4 md:px-8">
        <div className="flex flex-row items-center gap-0.5 lg:mr-14">
          <img src={logo} alt="FlightDeck Logo" className="h-8 min-w-fit" />

          <p className="text-muted hidden font-mono text-[10px] font-medium tracking-[1.4px] text-nowrap uppercase lg:block">
            Your job search, navigated with AI.
          </p>
        </div>

        <div className="hidden flex-row md:flex">
          {NAVIGATION.map((item) => (
            <Link
              to={item.url}
              key={item.url}
              data-tour={TOUR_IDS[item.url]}
              className={appLinkClass(item.url)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-row items-center gap-2 md:gap-4 lg:ml-auto">
          <Button
            className="bg-primary rounded-md"
            data-tour="new-application"
            onClick={handleNewApplication}
          >
            <PlusIcon className="size-3 stroke-4" />
            New Application
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden rounded-full md:flex"
            aria-label="Replay onboarding tour"
            onClick={() => openOnboarding()}
          >
            <InfoIcon className="size-3.5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOutIcon className="size-3.5" />
          </Button>
        </div>

        <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
          <DialogContent className="w-115 px-7.5 pt-7 pb-6">
            <DialogHeader className="space-y-2">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.5px] uppercase">
                Pilot sign-out · KLND
              </p>
              <DialogTitle className="font-display text-ink-strong text-[24px] leading-[1.2] font-bold tracking-[-0.6px]">
                Ready to land?
              </DialogTitle>
              <DialogDescription className="text-muted font-sans text-[14px] leading-[1.6]">
                Your applications and profile are saved. Your next flight picks
                up exactly where this one left off.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setLogoutOpen(false)}
                disabled={loggingOut}
                className="font-mono text-[12px] leading-[1.4] font-medium tracking-[0.9px] uppercase"
              >
                Stay Aboard
              </Button>
              <Button
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="font-mono text-[12px] leading-[1.4] font-medium tracking-[0.9px] uppercase"
                variant="destructive"
              >
                <LogOutIcon /> {loggingOut ? 'Logging out…' : 'Sign Out'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
