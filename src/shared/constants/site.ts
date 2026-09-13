export const SITE_ORIGIN = 'https://barenchi.tech'

export const SITE = {
  name: 'Barenchi',
  origin: SITE_ORIGIN,
  locale: 'en',
  localeAlternate: 'pt_BR',
  ogImagePath: '/hero-poster.jpg',
  logoPath: '/barenchi-logo-lockup.png',
  markPath: '/barenchi-mark.svg',
} as const

export function siteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  const raw = typeof fromEnv === 'string' && fromEnv.trim() ? fromEnv : SITE.origin
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const origin = siteOrigin()
  if (!path || path === '/') return `${origin}/`
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
