import { Link, useLocation } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

import { NAVIGATION } from '#/constants/navigations'

export default function MobileDock() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 flex w-full flex-row justify-center gap-4 border-t bg-white px-8 pt-1 pb-2 md:hidden">
      {NAVIGATION.map((item, index) => (
        <Link
          to={item.url}
          key={index}
          className="flex w-1/4 flex-col items-center gap-1 p-2"
        >
          <item.icon
            className={cn(
              'size-4',
              location.pathname === item.url ? 'text-primary' : 'text-muted',
            )}
          />
          <p
            className={cn(
              'text-muted font-sans text-[10px] leading-none text-nowrap',
              location.pathname === item.url
                ? 'text-primary font-semibold'
                : 'text-muted font-medium',
            )}
          >
            {item.label}
          </p>
        </Link>
      ))}
    </div>
  )
}
