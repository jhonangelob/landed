import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/flight-deck')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/flight-deck"!</div>
}
