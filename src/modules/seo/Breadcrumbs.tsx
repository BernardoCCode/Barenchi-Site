import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { ROUTES } from '@/shared/constants'

type BreadcrumbsProps = {
  current: string
}

export function Breadcrumbs({ current }: BreadcrumbsProps) {
  const { locale, t } = useI18n()

  return (
    <nav className="seo-crumbs" aria-label={locale === 'pt-BR' ? 'Trilha de navegação' : 'Breadcrumb'}>
      <ol>
        <li>
          <Link to={ROUTES.home}>{t.pages.home.crumb}</Link>
        </li>
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  )
}
