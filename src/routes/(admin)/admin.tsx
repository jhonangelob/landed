import { createFileRoute, redirect } from '@tanstack/react-router'

import SectionHeader from '#/components/layout/SectionHeader'

import { getSession } from '#/server/session'

export const Route = createFileRoute('/(admin)/admin')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Mission Control',
      },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()

    if (session?.user.role !== 'admin') {
      throw redirect({ to: '/app' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SectionHeader
        subTitle="Operations Overview"
        title1="Mission"
        title2="Control"
        description="How Landed is flying — users, revenue and platform usage at a glance."
      />
    </>
  )
}
