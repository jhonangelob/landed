import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/hangar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/hangar"!</div>
}
