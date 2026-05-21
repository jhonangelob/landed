import { useState } from 'react'

import { NAVIGATION } from '#/constant/navigations'
import {
  BellIcon,
  CircleQuestionMarkIcon,
  LogOutIcon,
  MenuIcon,
  Search,
} from 'lucide-react'

import { Link, useLocation } from '@tanstack/react-router'

import { signOut } from '#/lib/auth/client'
import { cn } from '#/lib/utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import logo from '/landed-logo.svg'

export default function Header() {
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const checkIfSelected = (path: string) => location.pathname === path

  const handleClickNotification = () => {
    console.log('unimplemented: Notification')
  }

  const handleClickLogout = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <header className="fixed top-0 left-0 z-99 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl flex-row items-center justify-between px-4 md:px-8">
        <div className="flex flex-row items-center gap-0.5 lg:mr-14">
          <img
            src={logo}
            alt="FlightDeck Logo"
            className="h-6 min-w-fit md:h-8"
          />

          <p className="text-foreground-soft2 hidden font-sans text-[13px] leading-[19.5px] text-nowrap md:block">
            Your job search, Navigated
          </p>
        </div>

        <div className="hidden flex-row gap-6 md:flex">
          {NAVIGATION.map((item) => (
            <Link
              to={item.url}
              key={item.url}
              className={cn(
                'border-primary flex h-16 items-center pt-0.5 font-sans text-[13px] leading-[19.5px] font-semibold text-nowrap',
                checkIfSelected(item.url)
                  ? 'text-primary! border-b-3'
                  : 'text-muted-foreground! pb-0.5',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden flex-row items-center gap-2 md:flex lg:ml-auto">
          <div className="relative hidden lg:block">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            className="cursor-pointer rounded-full p-0"
            onClick={handleClickNotification}
          >
            <CircleQuestionMarkIcon className="text-foreground-soft stroke-2.5" />
          </Button>

          <Button
            variant="ghost"
            className="group hover:border-destructive cursor-pointer rounded-md border border-white p-0 hover:bg-white"
            onClick={handleClickLogout}
          >
            <LogOutIcon className="text-foreground-soft stroke-2.5 shrink-0 transition-colors duration-300 group-hover:text-red-500" />
            <span className="text-muted-foreground overflow-hidden font-sans group-hover:max-w-20 group-hover:text-red-500 group-hover:opacity-100">
              Logout
            </span>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <MenuIcon className="text-primary h-5.5 w-5.5 cursor-pointer md:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col p-0">
            <SheetHeader className="border-border border-b px-4 pt-5 pb-3">
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Landed" className="h-6" />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
              {NAVIGATION.map((item) => (
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
