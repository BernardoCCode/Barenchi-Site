import type { SeoPageId } from './types'

export const SEO_CANONICAL: Record<SeoPageId, string> = {
  home: '/',
  about: '/',
  services: '/',
  contact: '/',
  notfound: '/',
}

const ALIAS_TO_PAGE: Record<string, SeoPageId> = {
  '/': 'home',
  '/sobre': 'about',
  '/about': 'about',
  '/servicos': 'services',
  '/services': 'services',
  '/contato': 'contact',
  '/contact': 'contact',
}

export function seoPageIdFromPath(pathname: string): SeoPageId {
  const path = pathname.replace(/\/+$/, '') || '/'
  return ALIAS_TO_PAGE[path] ?? 'notfound'
}

export function canonicalPathFor(pathname: string) {
  return SEO_CANONICAL[seoPageIdFromPath(pathname)]
}

export const INDEXABLE_PATHS = ['/'] as const
