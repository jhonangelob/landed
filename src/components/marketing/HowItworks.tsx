const steps = [
  {
    number: '01',
    title: 'Flight Deck',
    subtitle: 'Put every role on the board.',
    description:
      'Add a posting in seconds or pull it in with radar. Each application becomes a card you move between stages as it progresses.',
    tag: 'Spotted → Applied',
  },
  {
    number: '02',
    title: 'Co-Pilot',
    subtitle: 'Tailor your materials.',
    description:
      'Co-Pilot reads the posting against your Pilot Profile and drafts a CV and cover letter built for that exact role.',
    tag: 'Draft in seconds',
  },
  {
    number: '03',
    title: 'Landed',
    subtitle: 'Track it home. Share the win.',
    description:
      'Move each role through interview and offer on your deck, then turn the win into a shareable boarding pass the moment you land.',
    tag: 'Offer → Landed',
  },
]

export default function HowItWorks() {
  return (
    <div
      id="how-it-works"
      className="bg-surface-muted scroll-mt-10 px-4 py-12 md:px-16 md:py-29"
    >
      <div className="mx-auto flex max-w-295 flex-col gap-4">
        <p className="text-muted font-mono text-[11px] leading-[1.3] font-medium tracking-[1.3px] uppercase">
          How it Works
        </p>
        <p className="font-display text-ink-strong text-[32px] leading-[1.1] font-bold tracking-[-0.8px] md:text-[44px] md:leading-[1.08] md:tracking-[-1.1px]">
          Three steps from
          <br />
          <span className="text-primary italic">spotted</span> to signed.
        </p>
        <p className="text-muted font-sans text-[17px] leading-[1.6]">
          No new methodology to learn. Add a role, let Co-Pilot do the heavy
          lifting, and
          <br /> move it down the runway as it progresses.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              className="flex flex-col gap-2.5 rounded-lg border bg-white p-6"
              key={index}
            >
              <p className="text-primary font-mono text-[12px] leading-[1.4] font-normal tracking-[1.7px]">
                <span>{item.number}</span> - <span>{item.title}</span>
              </p>
              <p className="font-display text-ink-strong text-[17px] leading-[1.4] font-bold tracking-[-0.2px]">
                {item.subtitle}
              </p>
              <p className="text-muted font-sans text-[14px] leading-[1.6]">
                {item.description}
              </p>
              <div className="text-ink-muted w-fit rounded-full border bg-white px-2.5 py-1 font-mono text-[10px] leading-[1.4] tracking-[1.0px] uppercase">
                {item.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
