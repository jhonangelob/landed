import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/hangar')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="section">
      <SectionHeader
        title="Hangar"
        description="Manage your flight systems, AI parameters, and security clearance."
      />
      Hello "/(app)/hangar"!
    </div>
  )
}
