'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useI18n } from '@/i18n/I18nProvider'
import { AppLink } from '@/shared/components/AppLink'
import { motion, useReducedMotion } from 'motion/react'

export default function FAQs() {
  const { t } = useI18n()

  return (
    <section
      className="faqs relative z-[2] scroll-mt-[calc(var(--nav-h)+12px)] bg-[var(--paper)] px-0 py-[var(--space-section)] text-[var(--ink)]"
      id="faq"
    >
      <div className="wrap mx-auto">
        <header className="faqs-lead mx-auto mb-7 max-w-[36ch] text-center md:mb-9">
          <p className="m-0 mb-2.5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
            {t.faq.kicker}
          </p>
          <h2 className="m-0 font-[var(--font-serif)] text-[clamp(26px,3vw,40px)] font-normal leading-[1.02] tracking-[-0.03em]">
            <span className="block">{t.faq.headline[0]}</span>
            <span className="block italic text-[var(--brand)]">{t.faq.headline[1]}</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-[var(--muted)]">
            {t.faq.fallback}{' '}
            <AppLink href="/contato" className="text-[var(--ink)] underline underline-offset-[3px]">
              {t.faq.talkLink}
            </AppLink>
          </p>
        </header>

        <div className="faqs-list mx-auto w-full max-w-[640px]">
          <Accordion type="single" collapsible>
            {t.faq.items.map((item, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index + 1}`}
                className="border-[var(--hairline-mid)] first:border-t"
              >
                <AccordionTrigger className="min-h-11 cursor-pointer py-3 text-left font-[var(--font-sans)] text-[16px] font-normal leading-[1.35] tracking-[-0.02em] text-[var(--ink)] hover:no-underline md:py-3.5 md:text-[18px] [&_svg]:text-[var(--brand)]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <BlurredStagger text={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export const BlurredStagger = ({
  text = 'built by barenchi.tech',
}: {
  text: string
}) => {
  const reduce = useReducedMotion()

  if (reduce) {
    return <p className="max-w-[52ch] text-[15px] leading-[1.55] text-[var(--muted)]">{text}</p>
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.012,
      },
    },
  }

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
    },
  }

  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[52ch] text-[15px] leading-[1.55] break-words whitespace-normal text-[var(--muted)]"
      >
        {text.split(' ').map((word, wordIndex, words) => (
          <motion.span
            key={`${word}-${wordIndex}`}
            variants={letterAnimation}
            transition={{ duration: 0.3 }}
            className="inline-block whitespace-pre"
          >
            {word}
            {wordIndex < words.length - 1 ? '\u00A0' : null}
          </motion.span>
        ))}
      </motion.p>
    </div>
  )
}
