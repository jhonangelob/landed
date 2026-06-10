import { MenuIcon } from 'lucide-react'

import { Link, useLocation } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

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
  const location = useLocation()

  const checkIfSelected = (href: string) =>
    location.hash ? `/${location.hash}` === href.slice(1) : href === '/'

  return (
    <header className="fixed top-0 left-0 z-91 w-full border-b bg-white">
      <div className="max-w-8xl mx-auto flex h-16 flex-row items-center justify-between gap-8 px-4 md:px-8">
        <div className="flex flex-row items-center gap-0.5 lg:mr-14">
          <Link to="/">
            <img src={logo} alt="Landed Logo" className="h-8 min-w-fit" />
          </Link>

          <p className="text-muted hidden font-mono text-[10px] font-medium tracking-[1.4px] text-nowrap uppercase md:block">
            Your job search, Navigated
          </p>
        </div>

        <div className="hidden flex-row md:flex">
          {MARKETING_NAVIGATION.map((item) => (
            <a
              href={item.href}
              key={item.href}
              className={cn(
                'border-primary flex h-16 items-center px-4 pt-0.5 font-sans text-[13px] leading-[19.5px] font-semibold text-nowrap',
                checkIfSelected(item.href)
                  ? 'text-primary! border-b-3'
                  : 'text-muted-foreground! pb-0.5',
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden flex-row items-center gap-3 md:flex lg:ml-auto">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary rounded-md">
              Get started
            </Button>
          </Link>
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
                  className={cn(
                    'rounded px-3 py-2.5 font-sans text-[14px] font-semibold text-nowrap transition-colors',
                    checkIfSelected(item.href)
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="border-border flex flex-col gap-2 border-t px-4 py-4">
              <Link to="/login">
                <Button variant="outline" className="w-full" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary w-full" size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
