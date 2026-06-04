import { Link } from '@tanstack/react-router'

import { NAVIGATION } from '#/constants/navigations'

import logo from '/landed-logo.svg'

export default function MarketingFooter() {
  return (
    <div className="w-full border-t bg-white pt-16 pb-9">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-5 gap-7 border-b pb-12">
          <div className="col-span-2 space-y-2">
            <img src={logo} alt="FlightDeck Logo" className="h-10 min-w-fit" />
            <p className="text-muted font-sans text-[14px] leading-[1.6]">
              The control tower for your job search. Track,
              <br /> tailor and land — all on one runway.
            </p>
          </div>
          <div>
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
              Product
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {NAVIGATION.map((item, index) => (
                <Link
                  to={item.url}
                  key={index}
                  className="text-ink-muted! hover:text-primary! font-sans text-[14px] leading-[1.4]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
              Company
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {NAVIGATION.map((item, index) => (
                <Link
                  to={item.url}
                  key={index}
                  className="text-ink-muted! hover:text-primary! font-sans text-[14px] leading-[1.4]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
              Legal
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {NAVIGATION.map((item, index) => (
                <Link
                  to={item.url}
                  key={index}
                  className="text-ink-muted! hover:text-primary! font-sans text-[14px] leading-[1.4]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="text-muted flex flex-row items-center justify-between pt-6 font-mono text-[11px] leading-[1.4] tracking-[0.7px]">
          <p>© 2026 Landed, Inc. · Your job search, navigated</p>
          <p className="uppercase">KLND · 27L · MADE AT THE GATE</p>
        </div>
      </div>
    </div>
  )
}
