import { createFileRoute, redirect } from '@tanstack/react-router'

import { getSession } from '#/server/session'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/flight-deck', replace: true })
    } else {
      throw redirect({ to: '/login', replace: true })
    }
  },
})
