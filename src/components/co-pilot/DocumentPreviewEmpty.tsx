import { SparklesIcon } from 'lucide-react'

interface DocumentPreviewEmptyProps {
  variant: 'cv' | 'cover_letter'
}

export default function DocumentPreviewEmpty({
  variant,
}: DocumentPreviewEmptyProps) {
  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-8 rounded-lg border border-dashed px-4 py-10 text-center">
      <div className="relative w-44 space-y-1.5 rounded-md border p-3">
        <div className="h-2 w-1/2 rounded-lg bg-[#e2e3e9]"></div>
        <div className="h-1.5 w-1/4 rounded-sm bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-full rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/6 rounded-lg bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-full rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/6 rounded-lg bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-2/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>

        <div className="absolute top-23 right-14 rounded-full border bg-white p-6">
          <SparklesIcon className="text-primary/20 fill-primary size-3" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-display text-ink-strong text-[19px] leading-[1.6] font-bold tracking-[-0.5px]">
          {variant === 'cover_letter'
            ? 'Your cover letter.'
            : 'Your tailored CV.'}
        </p>
        <p className="text-ink-muted max-w-75 font-sans text-[13px] leading-[1.55]">
          {variant === 'cover_letter'
            ? 'Paste the job description on the left and hit Generate. Co-Pilot will write a short, specific cover letter in your voice.'
            : 'Paste the job description on the left and hit Generate. Co-Pilot will tailor your CV to match the role using your Pilot Profile.'}
        </p>
        <p className="text-muted w-fit rounded-full border px-3 py-1 font-mono text-[10px] leading-[1.6] tracking-[1.2px] uppercase">
          ← paste job details to get started
        </p>
      </div>
    </div>
  )
}
