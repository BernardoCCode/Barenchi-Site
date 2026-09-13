import type { Locale } from '@/i18n/types'
import { SITE, absoluteUrl } from '@/shared/constants/site'
import { GEO_MODIFIED_TIME, GEO_PUBLISHED_TIME } from './freshness'
import { buildJsonLd, type GeoServiceItem } from './jsonld'
import { canonicalPathFor, seoPageIdFromPath } from './routes'
import type { SeoCopy } from './types'

const JSON_LD_ID = 'barenchi-jsonld'

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const extraQuery = extra
    ? Object.entries(extra)
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('')
    : ''
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${extraQuery}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra) {
      for (const [key, value] of Object.entries(extra)) el.setAttribute(key, value)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applyDocumentSeo(input: {
  pathname: string
  locale: Locale
  copy: SeoCopy
  homeCrumb: string
  organizationDescription: string
  faqs: Array<{ question: string; answer: string }>
  services: GeoServiceItem[]
}) {
  const page = seoPageIdFromPath(input.pathname)
  const url = absoluteUrl(canonicalPathFor(input.pathname))
  const image = absoluteUrl(SITE.ogImagePath)
  const locale = input.locale === 'pt-BR' ? 'pt_BR' : 'en_US'
  const alternate = input.locale === 'pt-BR' ? 'en_US' : 'pt_BR'

  document.documentElement.lang = input.locale === 'pt-BR' ? 'pt-BR' : 'en'
  document.title = input.copy.title

  upsertMeta('meta[name="description"]', { name: 'description' }, input.copy.description)
  upsertMeta(
    'meta[name="robots"]',
    { name: 'robots' },
    page === 'notfound'
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  upsertMeta('meta[name="author"]', { name: 'author' }, SITE.name)
  upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE.name)
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, input.copy.title)
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, input.copy.description)
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, url)
  upsertMeta('meta[property="og:image"]', { property: 'og:image' }, image)
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, input.copy.title)
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, locale)
  upsertMeta('meta[property="og:locale:alternate"]', { property: 'og:locale:alternate' }, alternate)
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, input.copy.title)
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, input.copy.description)
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image)
  upsertMeta(
    'meta[property="article:published_time"]',
    { property: 'article:published_time' },
    GEO_PUBLISHED_TIME,
  )
  upsertMeta(
    'meta[property="article:modified_time"]',
    { property: 'article:modified_time' },
    GEO_MODIFIED_TIME,
  )

  if (page !== 'notfound') {
    upsertLink('canonical', url)
    upsertLink('alternate', url, { hreflang: 'en' })
    upsertLink('alternate', url, { hreflang: 'pt-BR' })
    upsertLink('alternate', url, { hreflang: 'x-default' })
  }

  const script =
    (document.getElementById(JSON_LD_ID) as HTMLScriptElement | null) ??
    Object.assign(document.createElement('script'), {
      id: JSON_LD_ID,
      type: 'application/ld+json',
    })
  if (!script.isConnected) document.head.appendChild(script)
  script.textContent = JSON.stringify(
    buildJsonLd({
      page,
      copy: input.copy,
      homeCrumb: input.homeCrumb,
      locale: input.locale,
      organizationDescription: input.organizationDescription,
      faqs: input.faqs,
      services: input.services,
    }),
  )
}
