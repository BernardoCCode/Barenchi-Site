import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { COMPANY } from '@/shared/constants/company'
import { ROUTES } from '@/shared/constants/routes'
import { detectLocale, getMessages, type Locale } from './index'
import type { Messages } from './types'

type I18nContextValue = {
  locale: Locale
  t: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())

  const t = useMemo(() => getMessages(locale), [locale])

  useEffect(() => {
    const sync = () => setLocale(detectLocale())
    window.addEventListener('languagechange', sync)
    return () => window.removeEventListener('languagechange', sync)
  }, [])

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      t,
    }),
    [locale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}

export function useNavLinks() {
  const { t } = useI18n()
  return useMemo(
    () => [
        { id: 'solutions' as const, label: t.nav.solutions, href: ROUTES.hashes.services },
        { id: 'studio' as const, label: t.nav.studio, href: ROUTES.hashes.studio },
        { id: 'about' as const, label: t.nav.about, href: ROUTES.hashes.about },
        { id: 'contact' as const, label: t.nav.contact, href: ROUTES.hashes.contact },
    ],
    [t],
  )
}

export function useHomeSolutions() {
  const { t } = useI18n()
  return useMemo(
    () =>
      (['landing', 'systems', 'automation', 'ecosystems'] as const).map((id) => ({
        id,
        number: { landing: '01', systems: '02', automation: '03', ecosystems: '04' }[id],
        title: t.services.home[id].title,
      })),
    [t],
  )
}

export function useHeroCapabilities(services: Array<{ title: string }>) {
  const { t } = useI18n()
  return `${t.hero.capabilitiesIntro} ${services.map((service) => service.title).join(', ')}.`
}

export function useCompanyTagline() {
  const { t } = useI18n()
  return t.company.tagline
}

export function useCopyright() {
  const { t } = useI18n()
  return `© ${new Date().getFullYear()} ${COMPANY.name}. ${t.common.copyright}`
}

export function usePageSeo(page: 'home' | 'about' | 'services' | 'contact' | 'notfound') {
  const { t } = useI18n()
  if (page === 'home') {
    return {
      title: t.meta.title,
      description: t.meta.description,
      crumb: t.pages.home.crumb,
    }
  }
  return t.pages[page]
}
