import { useI18n } from '@/i18n/I18nProvider'
import { AppLink } from '@/shared/components/AppLink'
import { ROUTES } from '@/shared/constants'

type TalkLinkProps = {
  href?: string
  className?: string
}

export function TalkLink({ href = ROUTES.hashes.contact, className }: TalkLinkProps) {
  const { t } = useI18n()

  return (
    <AppLink className={`talk${className ? ` ${className}` : ''}`} href={href}>
      <span className="talk-orb" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 12h12M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="talk-copy">
        <span className="talk-word">{t.common.talkToUs.word}</span>
        <span className="talk-rest">{t.common.talkToUs.rest}</span>
      </span>
    </AppLink>
  )
}
