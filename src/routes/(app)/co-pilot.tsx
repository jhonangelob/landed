import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/co-pilot')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="section">
      <SectionHeader
        title="Co-Pilot"
        description="Automated document crafting for your next career ascent."
      />
      Hello "/(app)/co-pilot"!
    </div>
  )
}
