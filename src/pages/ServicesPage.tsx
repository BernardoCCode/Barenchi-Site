import { ServiceSections } from '@/components/services/ServiceSections'
import { FinalCta } from '@/modules/home'
import { PageIntro, ServiceOutline } from '@/modules/seo'
import { useI18n } from '@/i18n/I18nProvider'

export function ServicesPage() {
  const { t } = useI18n()

  return (
    <div className="seo-page">
      <PageIntro
        heading={t.pages.services.heading}
        lead={t.pages.services.lead}
        crumb={t.pages.services.crumb}
      />
      <ServiceOutline />
      <ServiceSections />
      <FinalCta />
    </div>
  )
}
