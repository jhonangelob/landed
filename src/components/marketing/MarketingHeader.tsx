import {
  BellIcon,
  CircleQuestionMarkIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
} from 'lucide-react'

import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { signOut } from '#/lib/auth/client'
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
  const navigate = useNavigate()

  const checkIfSelected = (path: string) => location.pathname === path

  const handleClickNotification = () => {
    console.log('unimplemented: Notification')
  }
  const handleClickLogout = async () => {
    await signOut()
    navigate({ to: '/login' })
  }

  const handleNewApplication = () => {
    navigate({ to: '/app/co-pilot' })
  }

  return (
    <header className="fixed top-0 left-0 z-91 w-full border-b bg-white">
      <div className="max-w-8xl mx-auto flex h-16 flex-row items-center justify-between gap-8 px-4 md:px-8">
        <div className="flex flex-row items-center gap-0.5 lg:mr-14">
          <img src={logo} alt="FlightDeck Logo" className="h-8 min-w-fit" />

          <p className="text-muted hidden font-mono text-[10px] font-medium tracking-[1.4px] text-nowrap uppercase md:block">
            Your job search, Navigated
          </p>
        </div>

        <div className="hidden flex-row md:flex">
          {MARKETING_NAVIGATION.map((item) => (
            <Link
              to={item.url}
              key={item.url}
              className={cn(
                'border-primary flex h-16 items-center px-4 pt-0.5 font-sans text-[13px] leading-[19.5px] font-semibold text-nowrap',
                checkIfSelected(item.url)
                  ? 'text-primary! border-b-3'
                  : 'text-muted-foreground! pb-0.5',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden flex-row items-center gap-4 md:flex lg:ml-auto">
          <Button
            className="bg-primary rounded-md"
            onClick={handleNewApplication}
          >
            <PlusIcon />
            New Application
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleClickNotification}
          >
            <CircleQuestionMarkIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleClickLogout}
          >
            <LogOutIcon className="size-3.5" />
          </Button>
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
              ))}
            </nav>

            <div className="border-border flex items-center gap-3 border-t px-4 py-4">
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="icon" onClick={handleClickLogout}>
                  <BellIcon className="text-foreground-soft" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClickNotification}
                >
                  <CircleQuestionMarkIcon className="text-foreground-soft" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
