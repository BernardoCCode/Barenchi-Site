export const ROUTES = {
  home: '/',
  about: '/sobre',
  services: '/servicos',
  contact: '/contato',
  hashes: {
    services: '/#services',
    studio: '/#studio',
    about: '/#about',
    contact: '/#contact',
    faq: '/#faq',
  },
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES] | (typeof ROUTES.hashes)[keyof typeof ROUTES.hashes]
