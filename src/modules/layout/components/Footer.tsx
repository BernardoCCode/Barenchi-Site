import { Mail, MessageCircle } from 'lucide-react'
import { useCompanyTagline, useCopyright, useI18n } from '@/i18n/I18nProvider'
import { AppLink } from '@/shared/components/AppLink'
import { InstagramIcon } from '@/shared/components/InstagramIcon'
import { Logo } from '@/shared/components/Logo'
import { COMPANY, ROUTES, whatsappHref } from '@/shared/constants'

export function Footer() {
  const { t } = useI18n()
  const tagline = useCompanyTagline()
  const copyright = useCopyright()

  const footerLinks = [
    {
      title: t.common.studio,
      links: [
        { label: t.nav.solutions, href: ROUTES.hashes.services },
        { label: t.nav.studio, href: ROUTES.hashes.studio },
        { label: t.nav.about, href: ROUTES.hashes.about },
        { label: t.nav.contact, href: ROUTES.hashes.contact },
      ],
    },
    {
      title: t.common.work,
      links: [
        { label: t.common.solutions, href: ROUTES.hashes.services },
        { label: t.common.questions, href: ROUTES.hashes.faq },
        { label: t.common.startProject, href: ROUTES.hashes.contact },
      ],
    },
  ]

  const contactInfo = [
    {
      icon: Mail,
      text: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
    },
    {
      icon: MessageCircle,
      text: COMPANY.whatsapp.display,
      href: whatsappHref(),
    },
    {
      icon: InstagramIcon,
      text: COMPANY.instagram.handle,
      href: COMPANY.instagram.href,
    },
  ]

  return (
    <footer className="relative z-[2] border-t border-[var(--hairline-mid)] bg-[var(--paper)] text-[var(--ink)]">
      <div className="wrap py-12 pb-[max(3rem,env(safe-area-inset-bottom))] md:py-16">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-16">
          <div className="flex max-w-[32ch] flex-col gap-4">
            <Logo />
            <p className="m-0 text-sm leading-relaxed text-[var(--muted)]">{tagline}</p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="mb-5 text-[18px] font-normal tracking-[-0.03em] text-[var(--ink)]">
                {section.title}
              </p>
              <ul className="m-0 list-none space-y-3 p-0">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <AppLink
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-[15px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--brand)]"
                    >
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-5 text-[18px] font-normal tracking-[-0.03em] text-[var(--ink)]">
              {t.common.contact}
            </p>
            <ul className="m-0 list-none space-y-4 p-0">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.text} className="flex min-h-11 items-center gap-3">
                    <Icon size={18} className="shrink-0 text-[var(--brand)]" aria-hidden />
                    <a
                      href={item.href}
                      className="break-all text-[15px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--brand)]"
                      {...(item.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-0 border-t border-[var(--hairline-mid)]" />

        <div className="flex flex-wrap items-center text-[13px] text-[var(--muted)]">
          <p className="m-0 text-pretty">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
