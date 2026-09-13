import { useI18n } from '@/i18n/I18nProvider'
import { TalkLink } from '@/shared/components/TalkLink'

export function HeroCopy() {
  const { t, locale } = useI18n()
  const mobileLines =
    locale === 'pt-BR'
      ? [t.hero.colLeft[0], `${t.hero.colLeft[1]} ${t.hero.colRight[0]}`, t.hero.colRight[1]]
      : [`${t.hero.colLeft[0]} ${t.hero.colLeft[1]}`, t.hero.colRight[0], t.hero.colRight[1]]

  return (
    <div className="bhero-copy">
      <div className="bhero-manifesto wrap">
        <h1 className="visually-hidden">{t.hero.hidden}</h1>
        <p className="visually-hidden">{t.meta.description}</p>
        <div className="bhero-mobile-lockup" data-anim="title-col" aria-hidden="true">
          <span className="bhero-mobile-line">{mobileLines[0]}</span>
          <span className="bhero-mobile-line bhero-soft">{mobileLines[1]}</span>
          <span className="bhero-mobile-line">{mobileLines[2]}</span>
        </div>
        <div className="bhero-cols">
          <div className="bhero-col bhero-col-left" data-anim="title-col">
            <span aria-hidden="true" data-anim="title-line">
              {t.hero.colLeft[0]}
            </span>
            <span aria-hidden="true" className="bhero-soft" data-anim="title-line">
              {t.hero.colLeft[1]}
            </span>
          </div>
          <div className="bhero-col bhero-col-right" data-anim="title-col" aria-hidden="true">
            <span className="bhero-lead" data-anim="title-line">
              {t.hero.colRight[0]}
            </span>
            <span className="bhero-accent" data-anim="title-line">
              {t.hero.colRight[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="bhero-rail wrap" data-anim="rail">
        <TalkLink />
      </div>
    </div>
  )
}
