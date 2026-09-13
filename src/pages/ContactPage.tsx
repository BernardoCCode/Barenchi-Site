import { ContactSection } from '@/modules/home'
import { Breadcrumbs } from '@/modules/seo'
import { useI18n } from '@/i18n/I18nProvider'

export function ContactPage() {
  const { t } = useI18n()

  return (
    <div className="seo-page">
      <div className="seo-intro wrap">
        <Breadcrumbs current={t.pages.contact.crumb} />
      </div>
      <ContactSection variant="page" />
    </div>
  )
}
