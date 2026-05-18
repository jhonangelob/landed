import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="section">
      <SectionHeader
        title="Pilot Profile"
        description="Optimize your flight data for precise AI tailoring and career progression."
      />
      Hello "/(app)/profile"!
    </div>
  )
}
