import { MenuIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { useSession } from '#/lib/auth/client'

import { MARKETING_NAVIGATION } from '#/constants/navigations'

import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import logo from '/landed-logo.svg'

export default function MarketingHeader() {
  const { data: session } = useSession()

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
          {MARKETING_NAVIGATION.map((item) => (
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
          {session ? (
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
              {MARKETING_NAVIGATION.map((item) => (
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
              {session ? (
                <Button asChild className="bg-primary w-full rounded-md">
                  <Link to="/app" className="text-white!">
                    Go to Flight Deck
                  </Link>
                </Button>
              ) : (
                <div className="flex w-full gap-2">
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
      </div>
    </header>
  )
}
