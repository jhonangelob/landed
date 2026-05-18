import { APP } from '#/constant/common'
import { NAVIGATION } from '#/constant/navigations'
import { cn } from '#/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  BellIcon,
  CircleQuestionMarkIcon,
  MenuIcon,
  Search,
} from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'

import logo from '/landed-logo.svg'
import { useState } from 'react'

export default function Header() {
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const checkIfSelected = (path: string) => location.pathname === path

  const handleClickNotification = () => {
    console.log('unimplemented: Notification')
  }

  const handleClickInformation = () => {
    console.log('unimplemented: Information')
  }

  return (
    <header className="bg-white">
      <div className="max-w-7xl h-16 px-4 md:px-8 mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1 items-center lg:mr-14">
          <img
            src={logo}
            alt="FlightDeck Logo"
            className="min-w-fit h-6 md:h-8"
          />

          <p className="font-sans font-semibold text-[13px] text-foreground-soft2 leading-[19.5px] text-nowrap hidden md:block">
            {APP.tagline}
          </p>
        </div>

        {/* Desktop nav */}
        <div className="flex-row gap-6 hidden md:flex">
          {NAVIGATION.map((item) => (
            <Link
              to={item.url}
              key={item.url}
              className={cn(
                'font-sans text-nowrap text-[13px] leading-[19.5px] pt-0.5 font-semibold flex items-center h-16 border-primary',
                checkIfSelected(item.url)
                  ? 'border-b-3 text-primary!'
                  : 'text-muted-foreground! pb-0.5',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="lg:ml-auto flex-row items-center gap-2 hidden md:flex">
          <div className="relative lg:block hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className="p-0 rounded-full cursor-pointer"
            onClick={handleClickInformation}
          >
            <BellIcon className="text-foreground-soft stroke-2.5" />
          </Button>
          <Button
            variant="ghost"
            className="p-0 rounded-full cursor-pointer"
            onClick={handleClickNotification}
          >
            <CircleQuestionMarkIcon className="text-foreground-soft stroke-2.5" />
          </Button>

          <Avatar className="rounded-md">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile burger */}
        <Sheet>
          <SheetTrigger asChild>
            <MenuIcon className="h-5.5 w-5.5 cursor-pointer md:hidden text-primary" />
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-72">
            <SheetHeader className="px-4 pt-5 pb-3 border-b border-border">
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Landed" className="h-6" />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-3 gap-1 flex-1">
              {NAVIGATION.map((item) => (
                <Link
                  to={item.url}
                  key={item.url}
                  className={cn(
                    'font-sans text-nowrap text-[14px] font-semibold px-3 py-2.5 rounded transition-colors',
                    checkIfSelected(item.url)
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-4 border-t border-border flex items-center gap-3">
              <Avatar className="rounded-md">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClickInformation}
                >
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
