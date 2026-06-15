import { FOOTER_NAVIGATION } from '#/constants/navigations'

import logo from '/landed-logo.svg'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white px-4 pt-4 pb-4 md:pt-16 md:pb-9">
      <div className="mx-auto max-w-7xl">
        <div className="flex grid-cols-5 flex-col gap-7 border-b pb-4 md:grid md:pb-12">
          <div className="col-span-2 space-y-2">
            <img src={logo} alt="FlightDeck Logo" className="h-10 min-w-fit" />
            <p className="text-muted font-sans text-[14px] leading-[1.6]">
              The control tower for your job search. Track,
              <br /> tailor and land — all on one runway.
            </p>
          </div>
          {FOOTER_NAVIGATION.map((column) => (
            <div key={column.title}>
              <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
                {column.title}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {column.links.map((item) => (
                  <a
                    href={item.href}
                    key={item.label}
                    className="text-ink-muted! hover:text-primary! font-sans text-[14px] leading-[1.4]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-muted flex flex-col items-center justify-between pt-4 font-mono text-[11px] leading-[1.4] tracking-[0.7px] md:flex-row md:pt-6">
          <p>© 2026 Landed, Inc. · Your job search, navigated</p>
          <p className="uppercase">KLND · 27L · MADE AT THE GATE</p>
        </div>
      </div>
    </footer>
  )
}
