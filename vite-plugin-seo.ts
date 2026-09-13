import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

const ORIGIN = 'https://barenchi.tech'
const PUBLISHED = '2026-09-11'
const MODIFIED = '2026-09-13'
const PUBLISHED_TIME = `${PUBLISHED}T00:00:00Z`
const MODIFIED_TIME = `${MODIFIED}T00:00:00Z`

type SeoPageId = 'home' | 'about' | 'services' | 'contact'

type PrerenderPage = {
  path: string
  page: SeoPageId
  title: string
  description: string
  canonical: string
  crumb: string
}

const PAGES: PrerenderPage[] = [
  {
    path: '',
    page: 'home',
    canonical: '/',
    title: 'Custom software for your business | Barenchi',
    description:
      'Barenchi builds landing pages, custom systems and automation around the way you already work. Tell us what you want to ship.',
    crumb: 'Home',
  },
  {
    path: 'sobre',
    page: 'about',
    canonical: '/sobre',
    title: 'Software built around how you already work | Barenchi',
    description:
      'Barenchi hosts and maintains software built around your workflow. The code, data and rules stay yours — from the first call through every month after launch.',
    crumb: 'About',
  },
  {
    path: 'about',
    page: 'about',
    canonical: '/sobre',
    title: 'Software built around how you already work | Barenchi',
    description:
      'Barenchi hosts and maintains software built around your workflow. The code, data and rules stay yours — from the first call through every month after launch.',
    crumb: 'About',
  },
  {
    path: 'servicos',
    page: 'services',
    canonical: '/servicos',
    title: 'Landing pages, systems, ecosystems and automation | Barenchi',
    description:
      'High-performance landing pages, custom systems, ecommerce ecosystems and automation, shaped to the way your team already works. See what Barenchi ships.',
    crumb: 'Services',
  },
  {
    path: 'services',
    page: 'services',
    canonical: '/servicos',
    title: 'Landing pages, systems, ecosystems and automation | Barenchi',
    description:
      'High-performance landing pages, custom systems, ecommerce ecosystems and automation, shaped to the way your team already works. See what Barenchi ships.',
    crumb: 'Services',
  },
  {
    path: 'contato',
    page: 'contact',
    canonical: '/contato',
    title: "Have an idea? Let's build it. | Barenchi",
    description:
      'Tell Barenchi what you want to build. We turn the brief into a digital product and open WhatsApp with your message ready to send. Write today.',
    crumb: 'Contact',
  },
  {
    path: 'contact',
    page: 'contact',
    canonical: '/contato',
    title: "Have an idea? Let's build it. | Barenchi",
    description:
      'Tell Barenchi what you want to build. We turn the brief into a digital product and open WhatsApp with your message ready to send. Write today.',
    crumb: 'Contact',
  },
]

const SERVICES = [
  {
    name: 'Landing pages',
    description:
      'We design and build landing pages that make your business easier to understand, trust and choose.',
  },
  {
    name: 'Custom systems',
    description:
      "We build systems around your processes, rules and goals, instead of forcing your business into someone else's software.",
  },
  {
    name: 'Automation',
    description:
      'We connect the repetitive parts of your operation so work moves forward without constant manual intervention.',
  },
  {
    name: 'Ecosystems',
    description:
      'We assemble ecommerce ecosystems: store, stock, payments, CRM and channels, so the operation holds as one piece.',
  },
]

const FAQS = [
  {
    question: 'What does Barenchi build?',
    answer:
      'Landing pages, custom systems, ecommerce ecosystems, integrations and automation, shaped to the way a business already works, not to a generic mold.',
  },
  {
    question: 'Who is Barenchi for?',
    answer:
      'Founders and operators who have outgrown off-the-shelf tools, or who need software that follows a real workflow instead of a template.',
  },
  {
    question: 'Can the work follow our brand and process?',
    answer:
      'Yes. Design, architecture and implementation stay close to the operation. Roles, data and the way people actually work are part of the brief.',
  },
  {
    question: 'Do you connect to tools we already use?',
    answer:
      'Yes. Integrations and automation are part of the practice. The tools you already pay for can sit in one flow instead of being retyped between them.',
  },
  {
    question: 'How do we start?',
    answer:
      'Write for us with what you are trying to solve. We turn that into scope, design and a technical path, without asking you to buy a platform first.',
  },
]

const COMPANY_DESCRIPTION =
  'Barenchi builds landing pages, custom systems and automation around the way you already work. Tell us what you want to ship.'

function escapeAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function pageUrl(canonical: string) {
  return canonical === '/' ? `${ORIGIN}/` : `${ORIGIN}${canonical}`
}

function buildJsonLd(page: PrerenderPage) {
  const url = pageUrl(page.canonical)
  const orgId = `${ORIGIN}/#organization`
  const types =
    page.page === 'contact'
      ? ['WebPage', 'ContactPage']
      : page.page === 'about'
        ? ['WebPage', 'AboutPage']
        : ['WebPage']

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: 'Barenchi',
      url: `${ORIGIN}/`,
      description: COMPANY_DESCRIPTION,
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/barenchi-logo-lockup.png` },
      image: `${ORIGIN}/hero-poster.jpg`,
      email: 'barenchisoftware@gmail.com',
      telephone: '+55 21 98770-4552',
      sameAs: ['https://www.instagram.com/barenchi.tech'],
      address: { '@type': 'PostalAddress', addressCountry: 'BR', addressRegion: 'RJ' },
      knowsAbout: SERVICES.map((item) => item.name),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${ORIGIN}/#service`,
      name: 'Barenchi',
      url: `${ORIGIN}/`,
      image: `${ORIGIN}/hero-poster.jpg`,
      email: 'barenchisoftware@gmail.com',
      telephone: '+55 21 98770-4552',
      description: COMPANY_DESCRIPTION,
      areaServed: [
        { '@type': 'Country', name: 'Brazil' },
        { '@type': 'Place', name: 'Worldwide' },
      ],
      serviceType: SERVICES.map((item) => item.name),
      parentOrganization: { '@id': orgId },
    },
    {
      '@type': 'WebSite',
      '@id': `${ORIGIN}/#website`,
      name: 'Barenchi',
      url: `${ORIGIN}/`,
      inLanguage: ['en', 'pt-BR'],
      publisher: { '@id': orgId },
    },
    {
      '@type': types,
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${ORIGIN}/#website` },
      about: { '@id': orgId },
      author: { '@id': orgId },
      publisher: { '@id': orgId },
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      inLanguage: 'en',
    },
  ]

  if (page.page !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: page.crumb, item: url },
      ],
    })
  }

  if (page.page === 'home') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${ORIGIN}/#faq`,
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  if (page.page === 'home' || page.page === 'services') {
    graph.push({
      '@type': 'OfferCatalog',
      '@id': `${ORIGIN}/servicos#catalog`,
      name: 'Barenchi',
      itemListElement: SERVICES.map((item, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: item.name,
          description: item.description,
          provider: { '@id': orgId },
        },
      })),
    })
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function crawlerArticle(page: SeoPageId) {
  if (page === 'about') {
    return `<article>
<h1>Software built around how you already work.</h1>
<p>We design, host and run systems that follow the operation you already have, instead of asking you to rent a mold.</p>
<p>You already have a way of working. We build the software that can hold it.</p>
<h2>Hosted &amp; maintained</h2>
<p>Live on our infrastructure. Updates, uptime and backups: you never touch a server.</p>
<h2>Fully yours</h2>
<p>The code, the data and the rules belong to the operation, not a rented seat.</p>
<h2>Your stack, connected</h2>
<p>CRM, payments, inventory: wired into one flow instead of copy-paste between tabs.</p>
<h2>The same team</h2>
<p>From the first conversation through launch, and every month after — no switching teams.</p>
</article>`
  }

  if (page === 'services') {
    return `<article>
<h1>Landing pages, systems, ecosystems and automation, built to order.</h1>
<p>We ship high-performance websites, ERP and CRM layers, ecommerce ecosystems, internal tools, and the integrations that keep teams from repeating the same work every week.</p>
${SERVICES.map((item) => `<h2>${item.name}</h2><p>${item.description}</p>`).join('\n')}
</article>`
  }

  if (page === 'contact') {
    return `<article>
<h1>Have an idea? Let's build it.</h1>
<p>Tell us what you are trying to solve. We will turn it into a digital product, and the message goes straight to WhatsApp.</p>
<ul>
<li>WhatsApp: +55 21 98770-4552</li>
<li>Email: barenchisoftware@gmail.com</li>
</ul>
</article>`
  }

  return `<article>
<h1>Custom software for your business.</h1>
<p>${STUDIO_DESCRIPTION}</p>
${SERVICES.map((item) => `<h2>${item.name}</h2><p>${item.description}</p>`).join('\n')}
<h2>Questions worth answering.</h2>
${FAQS.map((item) => `<h3>${item.question}</h3><p>${item.answer}</p>`).join('\n')}
</article>`
}

function applyPageMeta(html: string, page: PrerenderPage) {
  const url = pageUrl(page.canonical)
  const title = escapeAttr(page.title)
  const description = escapeAttr(page.description)
  const jsonLd = buildJsonLd(page)
  const noscript = `<noscript id="barenchi-crawler">\n${crawlerArticle(page.page)}\n</noscript>`

  let next = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="alternate"\s+hreflang="en"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="alternate"\s+hreflang="pt-BR"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="alternate"\s+hreflang="x-default"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta\s+property="article:published_time"\s+content=")[^"]*(")/, `$1${PUBLISHED_TIME}$2`)
    .replace(/(<meta\s+property="article:modified_time"\s+content=")[^"]*(")/, `$1${MODIFIED_TIME}$2`)
    .replace(
      /<script type="application\/ld\+json" id="barenchi-jsonld">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="barenchi-jsonld">${jsonLd}</script>`,
    )

  if (next.includes('id="barenchi-crawler"')) {
    next = next.replace(/<noscript id="barenchi-crawler">[\s\S]*?<\/noscript>/, noscript)
  } else {
    next = next.replace('<div id="root"></div>', `${noscript}\n    <div id="root"></div>`)
  }

  return next
}

export function seoPrerender(): Plugin {
  return {
    name: 'barenchi-seo-prerender',
    apply: 'build',
    closeBundle() {
      const dist = join(process.cwd(), 'dist')
      const source = readFileSync(join(dist, 'index.html'), 'utf8')
      const home = PAGES.find((page) => page.page === 'home')
      if (home) writeFileSync(join(dist, 'index.html'), applyPageMeta(source, home))

      for (const page of PAGES) {
        if (!page.path) continue
        const dir = join(dist, page.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), applyPageMeta(source, page))
      }
    },
  }
}
