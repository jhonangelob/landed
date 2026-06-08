import { createFileRoute } from '@tanstack/react-router'

import CallToAction from '#/components/marketing/CallToAction'
import FAQ from '#/components/marketing/FAQ'
import Features from '#/components/marketing/Features'
import Hero from '#/components/marketing/Hero'
import InformationStrip from '#/components/marketing/InformationStrip'
import Pricing from '#/components/marketing/Pricing'
import HowItWorks from '#/components/marketing/HowItworks'

export const Route = createFileRoute('/(marketing)/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex min-w-full flex-col">
      <Hero />
      <InformationStrip />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CallToAction />
    </div>
  )
}
