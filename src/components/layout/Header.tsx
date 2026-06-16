import { useState } from 'react'

import { InfoIcon, LogOutIcon, MenuIcon, PlusIcon } from 'lucide-react'

import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { signOut, useSession } from '#/lib/auth/client'
import { useOnboardingStore } from '#/lib/store/onboarding'
import { cn } from '#/lib/utils'

import { MARKETING_NAVIGATION, NAVIGATION } from '#/constants/navigations'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import logo from '/landed-logo.svg'

/** Maps app nav URLs to the `data-tour` anchors the onboarding tour points at. */
const TOUR_IDS: Record<string, string> = {
  '/app': 'flight-deck',
  '/app/co-pilot': 'co-pilot',
  '/app/profile': 'profile',
  '/app/hangar': 'hangar',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session } = useSession()

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const openOnboarding = useOnboardingStore((s) => s.open)

  const inApp = location.pathname.startsWith('/app')

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

          <p className="text-muted hidden font-mono text-[10px] font-medium tracking-[1.4px] text-nowrap uppercase md:block">
            Your job search, navigated by AI.
          </p>
        </div>

        <div className="hidden flex-row md:flex">
          {inApp
            ? NAVIGATION.map((item) => (
                <Link
                  to={item.url}
                  key={item.url}
                  data-tour={TOUR_IDS[item.url]}
                  className={appLinkClass(item.url)}
                >
                  {item.label}
                </Link>
              ))
            : MARKETING_NAVIGATION.map((item) => (
                <a
                  href={item.href}
                  key={item.href}
                  className="text-muted-foreground hover:text-primary flex h-14 items-center px-4 font-sans text-[13px] leading-[19.5px] font-semibold text-nowrap transition-colors"
                >
                  {item.label}
                </a>
              ))}
        </div>

        <div className="hidden flex-row items-center gap-4 md:flex lg:ml-auto">
          {inApp ? (
            <>
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
                className="rounded-full"
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
            </>
          ) : session ? (
            <Button asChild className="bg-primary rounded-md">
              <Link to="/app" className="text-white!">
                Go to Flight Deck
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login" className="text-ink-strong! shadow-none!">
                  Log in
                </Link>
              </Button>
              <Button asChild className="bg-primary rounded-md">
                <Link to="/signup" className="text-white!">
                  Get started
                </Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <MenuIcon className="text-primary h-5.5 w-5.5 md:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col p-0">
            <SheetHeader className="border-border border-b px-4 pt-5 pb-3">
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Landed" className="h-6" />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
              {inApp
                ? NAVIGATION.map((item) => (
                    <Link
                      to={item.url}
                      key={item.url}
                      className={cn(
                        'rounded px-3 py-2.5 font-sans text-[14px] font-semibold text-nowrap transition-colors',
                        checkIfSelected(item.url)
                          ? 'text-primary bg-accent'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))
                : MARKETING_NAVIGATION.map((item) => (
                    <a
                      href={item.href}
                      key={item.href}
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-3 py-2.5 font-sans text-[14px] font-semibold text-nowrap transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
            </nav>

            <div className="border-border flex items-center gap-3 border-t px-4 py-4">
              {inApp ? (
                <div className="ml-auto flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Replay onboarding tour"
                    onClick={() => openOnboarding()}
                  >
                    <InfoIcon className="text-foreground-soft" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOutIcon className="text-foreground-soft" />
                  </Button>
                </div>
              ) : session ? (
                <Button asChild className="bg-primary w-full rounded-md">
                  <Link to="/app" className="text-white!">
                    Go to Flight Deck
                  </Link>
                </Button>
              ) : (
                <div className="flex w-full gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login" className="text-white!">
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="bg-primary flex-1 rounded-md">
                    <Link to="/signup" className="text-white!">
                      Get started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

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
