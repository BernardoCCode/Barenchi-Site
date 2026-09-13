import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { ROUTES } from '@/shared/constants'

export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <div className="seo-page">
      <header className="seo-intro wrap">
        <h1>{t.pages.notfound.heading}</h1>
        <p>{t.pages.notfound.lead}</p>
        <p>
          <Link to={ROUTES.home}>{t.pages.notfound.back}</Link>
        </p>
      </header>
    </div>
  )
}
