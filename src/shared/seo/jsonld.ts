import type { Locale } from '@/i18n/types'
import { COMPANY } from '@/shared/constants/company'
import { SITE, absoluteUrl } from '@/shared/constants/site'
import { GEO_DATES } from './freshness'
import { SEO_CANONICAL } from './routes'
import type { SeoCopy, SeoPageId } from './types'

type JsonLd = Record<string, unknown>

export type GeoServiceItem = {
  name: string
  description: string
}

function organizationNode(description: string, services?: GeoServiceItem[]): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${absoluteUrl('/')}#organization`,
    name: SITE.name,
    url: absoluteUrl('/'),
    description,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SITE.logoPath),
    },
    image: absoluteUrl(SITE.ogImagePath),
    email: COMPANY.email,
    telephone: COMPANY.whatsapp.display,
    sameAs: [COMPANY.instagram.href],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'RJ',
    },
    knowsAbout: services?.map((item) => item.name) ?? [
      'Landing pages',
      'Custom software',
      'Automation',
      'Ecommerce ecosystems',
    ],
  }
}

function professionalServiceNode(description: string, services?: GeoServiceItem[]): JsonLd {
  return {
    '@type': 'ProfessionalService',
    '@id': `${absoluteUrl('/')}#service`,
    name: SITE.name,
    url: absoluteUrl('/'),
    image: absoluteUrl(SITE.ogImagePath),
    email: COMPANY.email,
    telephone: COMPANY.whatsapp.display,
    description,
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    serviceType: services?.map((item) => item.name) ?? [
      'Landing pages',
      'Custom software',
      'Business systems',
      'Ecommerce ecosystems',
      'Automation',
    ],
    parentOrganization: { '@id': `${absoluteUrl('/')}#organization` },
  }
}

function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: SITE.name,
    url: absoluteUrl('/'),
    inLanguage: ['en', 'pt-BR'],
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
  }
}

function webPageNode(page: SeoPageId, copy: SeoCopy, locale: Locale): JsonLd {
  const path = SEO_CANONICAL[page]
  const types =
    page === 'contact'
      ? ['WebPage', 'ContactPage']
      : page === 'about'
        ? ['WebPage', 'AboutPage']
        : ['WebPage']

  return {
    '@type': types,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: copy.title,
    description: copy.description,
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    about: { '@id': `${absoluteUrl('/')}#organization` },
    author: { '@id': `${absoluteUrl('/')}#organization` },
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
    datePublished: GEO_DATES.published,
    dateModified: GEO_DATES.modified,
    inLanguage: locale,
  }
}

function breadcrumbNode(page: SeoPageId, homeLabel: string, pageLabel: string): JsonLd | null {
  if (page === 'home' || page === 'notfound') return null
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(SEO_CANONICAL[page])}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageLabel,
        item: absoluteUrl(SEO_CANONICAL[page]),
      },
    ],
  }
}

function faqNode(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl('/')}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function offerCatalogNode(items: GeoServiceItem[]): JsonLd {
  return {
    '@type': 'OfferCatalog',
    '@id': `${absoluteUrl(SEO_CANONICAL.services)}#catalog`,
    name: SITE.name,
    itemListElement: items.map((item, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: item.name,
        description: item.description,
        provider: { '@id': `${absoluteUrl('/')}#organization` },
      },
    })),
  }
}

export function buildJsonLd(input: {
  page: SeoPageId
  copy: SeoCopy
  homeCrumb: string
  locale: Locale
  organizationDescription: string
  faqs?: Array<{ question: string; answer: string }>
  services?: GeoServiceItem[]
}) {
  const graph: JsonLd[] = [
    organizationNode(input.organizationDescription, input.services),
    professionalServiceNode(input.organizationDescription, input.services),
    websiteNode(),
  ]

  if (input.page !== 'notfound') graph.push(webPageNode(input.page, input.copy, input.locale))

  const crumbs = breadcrumbNode(input.page, input.homeCrumb, input.copy.crumb)
  if (crumbs) graph.push(crumbs)
  if (input.page === 'home' && input.faqs?.length) graph.push(faqNode(input.faqs))
  if ((input.page === 'home' || input.page === 'services') && input.services?.length) {
    graph.push(offerCatalogNode(input.services))
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
