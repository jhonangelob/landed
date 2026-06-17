import { KANBAN_COLUMNS } from '#/constants/stage'

import QuickAddField from './QuickAddField'

export default function KanbanBoardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-13 py-12">
      <div className="flex flex-row gap-4">
        {KANBAN_COLUMNS.map((item, index) => (
          <>
            <div className="flex flex-col items-center gap-1" key={index}>
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.3px]">
                0{index + 1}
              </p>
              <p className="text-muted font-sans text-[11px] leading-[1.4]">
                {item.label}
              </p>
            </div>
            {index < KANBAN_COLUMNS.length - 1 && (
              <div className="h-px w-24 flex-1 border-t" />
            )}
          </>
        ))}
      </div>
      <div className="flex flex-col gap-13 text-center">
        <div className="space-y-4">
          <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
            Flight Deck · 0 applications
          </p>
          <p className="text-ink-strong font-display text-[42px] leading-[1.08] font-bold tracking-[-1.1px]">
            Runway clear.
            <br />
            Ready for takeoff.
          </p>
          <p className="text-ink-strong font-sans text-[15px] leading-[1.6]">
            Your Flight Deck tracks every application as a boarding pass, moving
            <br />
            through six stages — from first spotted to fully landed. Add your
            first one
            <br /> below.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
            Add your first application
          </p>
          <QuickAddField />
        </div>
      </div>
    </div>
  )
}
