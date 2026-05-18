import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/co-pilot')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/co-pilot"!</div>
}
