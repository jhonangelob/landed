import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/flight-deck')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="section">
      <SectionHeader
        title="Flight Deck"
        description="Real-time telemetry for your professional trajectory."
      />
      Hello "/(app)/flight-deck"!
    </div>
  )
}
