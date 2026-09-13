import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n, useNavLinks } from '@/i18n/I18nProvider'
import { AppLink } from '@/shared/components/AppLink'
import { Logo } from '@/shared/components/Logo'
import { TalkLink } from '@/shared/components/TalkLink'
import { COMPANY } from '@/shared/constants'
import { useScrolled } from '@/shared/hooks'
import { EASE } from '@/shared/motion'

function useCapsuleActive() {
  const { pathname } = useLocation()
  const [section, setSection] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === '/servicos' || pathname === '/services') {
      setSection('solutions')
      return
    }
    if (pathname === '/sobre' || pathname === '/about') {
      setSection('about')
      return
    }
    if (pathname === '/contato' || pathname === '/contact') {
      setSection('contact')
      return
    }
    if (pathname !== '/') {
      setSection(null)
      return
    }

    const spots: { id: string; key: string }[] = [
      { id: 'capabilities-poster', key: 'solutions' },
      { id: 'services', key: 'solutions' },
      { id: 'service-landing', key: 'solutions' },
      { id: 'service-systems', key: 'solutions' },
      { id: 'service-automation', key: 'solutions' },
      { id: 'service-ecosystems', key: 'solutions' },
      { id: 'studio', key: 'studio' },
      { id: 'about', key: 'about' },
      { id: 'faq', key: 'about' },
      { id: 'contact', key: 'contact' },
    ]
    const nodes = spots
      .map((spot) => ({ ...spot, el: document.getElementById(spot.id) }))
      .filter((spot): spot is { id: string; key: string; el: HTMLElement } => Boolean(spot.el))

    let frame = 0
    const pick = () => {
      const line = window.innerHeight * 0.38
      let current: string | null = null
      for (const spot of nodes) {
        const box = spot.el.getBoundingClientRect()
        if (box.top <= line && box.bottom > line + 48) current = spot.key
      }
      if (!current) {
        for (const spot of nodes) {
          if (spot.el.getBoundingClientRect().top <= line) current = spot.key
        }
      }
      setSection((value) => (value === current ? value : current))
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        pick()
      })
    }

    const syncHash = () => {
      const hash = window.location.hash.replace('#', '')
      const hashed = spots.find((spot) => spot.id === hash)
      if (hashed) setSection(hashed.key)
      else pick()
    }

    syncHash()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('hashchange', syncHash)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('hashchange', syncHash)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  return section
}

function CapsuleNav({
  active,
  reduce,
  links,
  primaryLabel,
}: {
  active: string | null
  reduce: boolean | null
  links: ReturnType<typeof useNavLinks>
  primaryLabel: string
}) {
  const rootRef = useRef<HTMLElement>(null)
  const skipTravel = useRef(true)
  const [hot, setHot] = useState<string | null>(null)
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false })

  const targetId = hot ?? active

  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const id = hot ?? active
    const el = id ? root.querySelector<HTMLElement>(`[data-nav="${id}"]`) : null
    if (!el) {
      setPill((current) => (current.visible ? { ...current, visible: false } : current))
      return
    }
    setPill({
      x: el.offsetLeft,
      y: el.offsetTop,
      w: el.offsetWidth,
      h: el.offsetHeight,
      visible: true,
    })
  }, [hot, active])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useLayoutEffect(() => {
    if (!pill.visible) {
      skipTravel.current = true
      return
    }
    const frame = window.requestAnimationFrame(() => {
      skipTravel.current = false
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pill.visible])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(root)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const snap = Boolean(reduce) || skipTravel.current

  return (
    <nav
      ref={rootRef}
      className="nav-capsule"
      aria-label={primaryLabel}
      onPointerLeave={() => setHot(null)}
    >
      <motion.span
        className="nav-capsule-pill"
        aria-hidden="true"
        initial={false}
        animate={{
          x: pill.x,
          y: pill.y,
          width: pill.w,
          height: pill.h,
          opacity: pill.visible ? 1 : 0,
        }}
        transition={{
          x: { duration: snap ? 0 : 0.48, ease: EASE },
          y: { duration: snap ? 0 : 0.48, ease: EASE },
          width: { duration: snap ? 0 : 0.48, ease: EASE },
          height: { duration: snap ? 0 : 0.48, ease: EASE },
          opacity: { duration: reduce ? 0 : 0.22, ease: EASE },
        }}
      />
      {links.map((link) => {
        const isActive = active === link.id
        const isTarget = targetId === link.id
        return (
          <AppLink
            key={link.id}
            data-nav={link.id}
            className={`nav-capsule-link${isActive ? ' is-active' : ''}${isTarget ? ' is-on' : ''}`}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === 'touch') return
              setHot(link.id)
            }}
            onFocus={() => setHot(link.id)}
            onBlur={(event) => {
              if (!rootRef.current?.contains(event.relatedTarget as Node)) setHot(null)
            }}
          >
            {link.label}
          </AppLink>
        )
      })}
    </nav>
  )
}

function NavMail() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    const value = COMPANY.email
    const clipboard = navigator.clipboard
    const copiedViaApi = clipboard
      ? await Promise.race([
          clipboard.writeText(value).then(() => true).catch(() => false),
          new Promise<false>((resolve) => window.setTimeout(() => resolve(false), 250)),
        ])
      : false

    if (copiedViaApi) {
      setCopied(true)
      return
    }

    const field = document.createElement('textarea')
    field.value = value
    field.setAttribute('readonly', '')
    field.style.cssText = 'position:fixed;left:-9999px;top:0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    field.remove()

    if (ok) setCopied(true)
    else window.location.href = `mailto:${value}`
  }

  return (
    <button
      type="button"
      className={`nav-mail${copied ? ' is-copied' : ''}`}
      onClick={copyEmail}
      aria-label={copied ? t.navUi.emailCopied : `${t.navUi.copyEmail} ${COMPANY.email}`}
    >
      {copied ? <Check size={16} strokeWidth={1.4} /> : <Copy size={16} strokeWidth={1.4} />}
      <span className="nav-mail-label">{copied ? t.navUi.emailCopied : COMPANY.email}</span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? t.navUi.emailCopied : ''}
      </span>
    </button>
  )
}

function MobileMenuGlyph({ open }: { open: boolean }) {
  return (
    <span className={`menu-glyph${open ? ' is-open' : ''}`} aria-hidden="true">
      <span className="menu-glyph-line menu-glyph-line-top" />
      <span className="menu-glyph-line menu-glyph-line-middle" />
      <span className="menu-glyph-line menu-glyph-line-bottom" />
    </span>
  )
}

export function Navbar() {
  const { t } = useI18n()
  const navLinks = useNavLinks()
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const active = useCapsuleActive()
  const overHero = pathname === '/' && !scrolled && !open
  const solid = pathname !== '/' || scrolled || open

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)')
    const closeDesktop = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', closeDesktop)
    return () => media.removeEventListener('change', closeDesktop)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('nav-open', open)
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('nav-open')
    }
  }, [open])

  return (
    <>
      <motion.header
        className={`nav${solid ? ' nav-scrolled' : ''}${overHero ? ' nav-over-hero' : ''}`}
        initial={reduce ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="wrap nav-inner">
          <Logo />
          <CapsuleNav active={active} reduce={reduce} links={navLinks} primaryLabel={t.navUi.primary} />
          <div className="nav-right">
            <NavMail />
            <button
              className="menu-btn"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t.navUi.closeMenu : t.navUi.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              <MobileMenuGlyph open={open} />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              key="menu-backdrop"
              type="button"
              className="menu-backdrop"
              aria-label={t.navUi.closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="menu-panel"
              id="mobile-nav"
              className="menu-panel"
              aria-label={t.navUi.mobile}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="menu-panel-list">
                {navLinks.map((link) => (
                  <AppLink
                    key={link.id}
                    className="menu-panel-link"
                    href={link.href}
                    aria-current={active === link.id ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </AppLink>
                ))}
              </div>
              <div className="menu-panel-foot">
                <NavMail />
                <TalkLink />
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
