const clients = [
  'Stripe',
  'Linear',
  'Figma',
  'Notion',
  'Ramp',
  'Vercel',
  ' Antrophic',
]

export default function InformationStrip() {
  return (
    <div className="flex items-center justify-center gap-12 bg-white py-6.5">
      <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.5px] uppercase">
        TRACKING APPLICANTS TO{' '}
      </p>
      <div className="flex flex-row items-center gap-4">
        {clients.map((item) => (
          <p
            className="font-display text-ink-muted text-[17px] leading-[1.4] font-bold"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}
