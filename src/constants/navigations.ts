import { FileTextIcon, KanbanIcon, SparkleIcon, UserIcon } from 'lucide-react'

export const NAVIGATION = [
  { label: 'Flight Deck', url: '/app', icon: KanbanIcon },
  { label: 'Co-Pilot', url: '/app/co-pilot', icon: SparkleIcon },
  { label: 'Pilot Profile', url: '/app/profile', icon: UserIcon },
  { label: 'Hangar', url: '/app/hangar', icon: FileTextIcon },
]

export const MARKETING_NAVIGATION = [
  {
    label: 'How it works',
    href: '/#how-it-works',
  },
  {
    label: 'Features',
    href: '/#features',
  },
  {
    label: 'Pricing',
    href: '/#pricing',
  },
  {
    label: 'FAQ',
    href: '/#faq',
  },
]

export const FOOTER_NAVIGATION = [
  {
    title: 'Product',
    links: MARKETING_NAVIGATION,
  },
  {
    title: 'Company',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
]
