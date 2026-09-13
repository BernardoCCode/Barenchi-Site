import { AnimatedFormFrame } from '@/components/ui/animated-form-frame'
import { FloatingField } from '@/components/ui/floating-field'
import { useI18n } from '@/i18n/I18nProvider'
import { InstagramIcon } from '@/shared/components/InstagramIcon'
import { WhatsAppIcon } from '@/shared/components/WhatsAppIcon'
import { COMPANY, whatsappHref } from '@/shared/constants'
import { composeWhatsAppMessage } from '@/shared/lib/composeWhatsAppMessage'
import { EASE } from '@/shared/motion'
import { ArrowUpRight, Mail, MessageSquare, User } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import './ContactSection.css'

type ContactSectionProps = {
  variant?: 'band' | 'page'
}

type Field = 'name' | 'email' | 'message'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactSection({ variant = 'band' }: ContactSectionProps) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const unlock = () => setSubmitting(false)
    window.addEventListener('pagehide', unlock)
    window.addEventListener('pageshow', unlock)
    return () => {
      window.removeEventListener('pagehide', unlock)
      window.removeEventListener('pageshow', unlock)
    }
  }, [])

  const validate = () => {
    const next: Partial<Record<Field, string>> = {}
    if (!name.trim()) next.name = t.contact.fields.name.error
    if (!email.trim()) next.email = t.contact.fields.email.errorRequired
    else if (!EMAIL.test(email.trim())) next.email = t.contact.fields.email.errorInvalid
    if (!message.trim()) next.message = t.contact.fields.message.error
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      setSent(false)
      return
    }

    setSubmitting(true)
    setSent(true)
    const href = whatsappHref(
      composeWhatsAppMessage(t.contact.whatsapp, {
        name: name.trim(),
        email: email.trim(),
        intent: message.trim(),
      }),
    )
    window.setTimeout(() => {
      window.location.assign(href)
      window.setTimeout(() => setSubmitting(false), 1600)
    }, reduce ? 0 : 420)
  }

  const fieldMotion = (index: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay: 0.08 * index, ease: EASE },
        }

  return (
    <section className={`contact${variant === 'page' ? ' contact-page' : ''}`} id="contact">
      <div className="wrap contact-inner">
        <div className="contact-kicker-row">
          <span className="contact-kicker-line" aria-hidden="true" />
          <p className="contact-kicker">{t.contact.kicker}</p>
          <span className="contact-kicker-line" aria-hidden="true" />
        </div>
        <motion.div
          className="contact-copy"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.08, margin: '0px 0px 18% 0px' },
                transition: { duration: 0.45, ease: EASE },
              })}
        >
          {variant === 'page' ? <h1>{t.contact.headline}</h1> : <h2>{t.contact.headline}</h2>}
          <p>{t.contact.intro}</p>

          <ul className="contact-ways">
            <li>
              <div className="contact-way-icon" aria-hidden>
                <WhatsAppIcon size={18} />
              </div>
              <div className="contact-way-copy">
                <a
                  className="contact-way-number"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${COMPANY.whatsapp.display}`}
                >
                  {COMPANY.whatsapp.display}
                </a>
                <span>{t.contact.whatsappHint}</span>
              </div>
            </li>
            <li>
              <div className="contact-way-icon" aria-hidden>
                <Mail size={18} strokeWidth={1.6} />
              </div>
              <div className="contact-way-copy">
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                <span>{t.contact.emailHint}</span>
              </div>
            </li>
            <li>
              <div className="contact-way-icon" aria-hidden>
                <InstagramIcon size={18} />
              </div>
              <div className="contact-way-copy">
                <a
                  href={COMPANY.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${COMPANY.instagram.handle}`}
                >
                  {COMPANY.instagram.handle}
                </a>
                <span>{t.contact.instagramHint}</span>
              </div>
            </li>
          </ul>
        </motion.div>

        <AnimatedFormFrame className="contact-form-frame">
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <motion.div {...fieldMotion(0)}>
              <FloatingField
                label={t.contact.fields.name.label}
                name="name"
                value={name}
                onChange={setName}
                icon={<User size={16} />}
                autoComplete="name"
                required
                invalid={Boolean(errors.name)}
                hint={errors.name ?? t.contact.fields.name.hint}
              />
            </motion.div>

            <motion.div {...fieldMotion(1)}>
              <FloatingField
                label={t.contact.fields.email.label}
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                icon={<Mail size={16} />}
                autoComplete="email"
                inputMode="email"
                required
                invalid={Boolean(errors.email)}
                hint={errors.email ?? t.contact.fields.email.hint}
              />
            </motion.div>

            <motion.div {...fieldMotion(2)}>
              <FloatingField
                label={t.contact.fields.message.label}
                name="message"
                value={message}
                onChange={setMessage}
                icon={<MessageSquare size={16} />}
                multiline
                rows={5}
                maxLength={600}
                required
                invalid={Boolean(errors.message)}
                hint={errors.message ?? t.contact.fields.message.hint}
              />
            </motion.div>

            <motion.div className="contact-submit-wrap" {...fieldMotion(3)}>
              <motion.button
                className="btn btn-primary contact-submit"
                type="submit"
                disabled={submitting}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {submitting ? (
                    <motion.span
                      key="loading"
                      className="contact-submit__loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="contact-submit__spinner" aria-hidden />
                      {t.contact.submitting}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="contact-submit__label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {t.contact.submit}
                      <ArrowUpRight size={16} aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
                {!reduce ? <span className="contact-submit__sheen" aria-hidden /> : null}
              </motion.button>
              <p className="contact-note">
                {sent && !submitting ? t.contact.noteSent : t.contact.noteIdle}
              </p>
            </motion.div>
          </form>
        </AnimatedFormFrame>
      </div>
    </section>
  )
}
