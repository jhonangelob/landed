import { CheckIcon } from 'lucide-react'

const features = [
  {
    title: 'The Flight Deck',
    description:
      'A board for every application — Spotted, Applied, In Flight, Interview, Offer, Landed. Move a role to the next stage as it progresses; nothing slips through the cracks.',
  },
  {
    title: 'Co-Pilot tailoring',
    description:
      'Paste a job posting. Co-Pilot cross-references your Pilot Profile and drafts a CV and cover letter tuned to that exact role — in seconds.',
  },
  {
    title: 'One Pilot Profile',
    description:
      'Keep one master record of your experience, skills and wins. Every document Co-Pilot writes pulls from it, so you only update things once.',
  },
  {
    title: 'Interview-prep briefings',
    description:
      'Walk into each round with a briefing on the company, the role and likely questions — generated from the posting and your notes.',
  },
  {
    title: 'Negotiation transcripts',
    description:
      'Scripts and talking points for the offer conversation, so you ask for the number you actually want without the cold sweat.',
  },
  {
    title: 'Job-board radar',
    description:
      'Pull roles in from across the boards you care about, straight onto your deck as Spotted — no more twelve open tabs.',
  },
]

export default function Features() {
  return (
    <div
      id="features"
      className="bg-surface-subtle px-4 py-12 md:px-16 md:py-29"
    >
      <div className="mx-auto flex max-w-295 flex-col gap-4">
        <p className="text-muted font-mono text-[11px] leading-[1.3] font-medium tracking-[1.3px] uppercase">
          Features
        </p>
        <p className="font-display text-ink-strong text-[44px] leading-[1.08] font-bold tracking-[-1.1px]">
          Everything between
          <br />
          <span className="text-primary italic">"applied"</span> and "landed".
        </p>
        <p className="text-muted font-sans text-[17px] leading-[1.6]">
          One workspace for the whole search — the tracking, the writing, and
          the prep that
          <br /> usually lives in a dozen scattered docs.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              className="flex flex-col gap-2.5 rounded-lg border bg-white p-6"
              key={index}
            >
              <CheckIcon className="border-primary/20 bg-primary/10 text-primary size-10 rounded-md border stroke-2 p-2" />
              <p className="font-display text-ink-strong text-[17px] leading-[1.4] font-bold tracking-[-0.2px]">
                {item.title}
              </p>
              <p className="text-muted font-sans text-[14px] leading-[1.6]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
