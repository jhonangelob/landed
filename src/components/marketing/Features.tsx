import {
  FileTextIcon,
  ImportIcon,
  KanbanIcon,
  PartyPopperIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'

const iconClassName =
  'border-primary/20 bg-primary/10 text-primary size-8 rounded-md border stroke-2 p-2'

const features = [
  {
    title: 'The Flight Deck',
    description:
      'A board for every application: Spotted, Applied, In Flight, Interview, Offer, Landed. Move a role to the next stage as it progresses; nothing slips through the cracks.',
    icon: <KanbanIcon className={iconClassName} />,
  },
  {
    title: 'Co-Pilot tailoring',
    description:
      'Paste a job posting. Co-Pilot cross-references your Pilot Profile and drafts a CV and cover letter tuned to that exact role, in seconds.',
    icon: <SparklesIcon className={iconClassName} />,
  },
  {
    title: 'One Pilot Profile',
    description:
      'Keep one master record of your experience, skills and wins. Every document Co-Pilot writes pulls from it, so you only update things once.',
    icon: <UserIcon className={iconClassName} />,
  },
  {
    title: 'CV import',
    description:
      'Drop in your existing CV as a PDF or DOCX and Co-Pilot reads it straight into your Pilot Profile, no retyping your whole history.',
    icon: <ImportIcon className={iconClassName} />,
  },
  {
    title: 'Polished CV templates',
    description:
      'Export any tailored CV to a clean PDF (pick from Classic, Minimal or Modern), ready to send the moment you finish editing.',
    icon: <FileTextIcon className={iconClassName} />,
  },
  {
    title: 'Shareable touchdown',
    description:
      'Land the role and Landed turns your search into a shareable boarding pass: the applications, the days, the win, ready to post.',
    icon: <PartyPopperIcon className={iconClassName} />,
  },
]

export default function Features() {
  return (
    <div
      id="features"
      className="bg-surface-subtle scroll-mt-10 px-4 py-12 md:px-16 md:py-29"
    >
      <div className="mx-auto flex max-w-295 flex-col gap-4">
        <p className="text-muted font-mono text-[11px] leading-[1.3] font-medium tracking-[1.3px] uppercase">
          Features
        </p>
        <p className="font-display text-ink-strong text-[32px] leading-[1.1] font-bold tracking-[-0.8px] md:text-[44px] md:leading-[1.08] md:tracking-[-1.1px]">
          Everything between
          <br />
          <span className="text-primary italic">"applied"</span> and "landed".
        </p>
        <p className="text-muted font-sans text-[17px] leading-[1.6]">
          One workspace for the whole search: the tracking, the tailoring, and
          the polish that
          <br /> usually lives in a dozen scattered docs.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              className="flex flex-col gap-2.5 rounded-lg border bg-white p-6"
              key={index}
            >
              {item.icon}
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
