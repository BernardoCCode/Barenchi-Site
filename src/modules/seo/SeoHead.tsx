import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n, usePageSeo } from '@/i18n/I18nProvider'
import { applyDocumentSeo, seoPageIdFromPath } from '@/shared/seo'
import './seo-page.css'

export function SeoHead() {
  const { locale, t } = useI18n()
  const { pathname } = useLocation()
  const page = seoPageIdFromPath(pathname)
  const copy = usePageSeo(page)

  useLayoutEffect(() => {
    applyDocumentSeo({
      pathname,
      locale,
      copy,
      homeCrumb: t.pages.home.crumb,
      organizationDescription: t.meta.description,
      faqs: t.faq.items,
      services: (['landing', 'systems', 'automation', 'ecosystems'] as const).map((id) => ({
        name: t.services.home[id].title,
        description: t.services.home[id].lead,
      })),
    })
  }, [copy, locale, pathname, t])

  return null
}
