import { useI18n } from '@/i18n/I18nProvider'
import { GEO_DATES } from '@/shared/seo'
import { Breadcrumbs } from './Breadcrumbs'
import './seo-page.css'

type PageIntroProps = {
  heading: string
  lead: string
  crumb: string
}

function formatReviewed(locale: string) {
  const [year, month, day] = GEO_DATES.modified.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PageIntro({ heading, lead, crumb }: PageIntroProps) {
  const { locale, t } = useI18n()

  return (
    <header className="seo-intro wrap">
      <Breadcrumbs current={crumb} />
      <h1>{heading}</h1>
      <p>{lead}</p>
      <p className="seo-reviewed">
        <time dateTime={GEO_DATES.modified}>
          {t.common.updated} {formatReviewed(locale)}
        </time>
      </p>
    </header>
  )
}
