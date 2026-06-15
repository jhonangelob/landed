export const NAVIGATION = [
  { label: 'Flight Deck', url: '/app' },
  { label: 'Co-Pilot', url: '/app/co-pilot' },
  { label: 'Pilot Profile', url: '/app/profile' },
  { label: 'Hangar', url: '/app/hangar' },
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
