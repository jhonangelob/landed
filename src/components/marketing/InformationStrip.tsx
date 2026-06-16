import { cn } from '#/lib/utils'

const data = [
  { name: 'pilots aboard', data: 742 },
  { name: 'applications tracked', data: 1284 },
  { name: 'active subscribers', data: 218 },
  { name: 'Co-Pilot generations', data: 9460 },
]

export default function InformationStrip() {
  // return null if applications are less than 100
  return null

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white px-4 py-6 md:flex-row md:gap-12 md:py-6.5">
      <div className="flex flex-row items-center justify-center gap-x-4 gap-y-2 md:gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col px-1 text-center lg:px-12',
              index + 1 < data.length && 'border-r',
            )}
          >
            <p className="font-display text-ink-strong text-[18px] leading-none font-black tracking-[-0.8p[x]] lg:text-[28px]">
              {item.data}
            </p>
            <p className="font-monot text-muted text-[8px] leading-[1.4] tracking-[1px] uppercase lg:text-[10px]">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
