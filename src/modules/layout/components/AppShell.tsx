import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { useScrollExperience } from '@/shared/hooks'
import { isReloadNavigation } from '@/shared/motion/resetOnReload'
import { scrollToHash } from '@/shared/motion/scrollToHash'
import { SeoHead } from '@/modules/seo'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function AppShell() {
  const { t } = useI18n()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const skipHashAfterReload = useRef(isReloadNavigation())

  useLayoutEffect(() => {
    if (skipHashAfterReload.current) {
      skipHashAfterReload.current = false
      window.scrollTo(0, 0)
      return
    }
    if (hash) scrollToHash(hash)
  }, [pathname, hash])

  useScrollExperience(pathname)

  useLayoutEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as Element | null)?.closest('a')
      if (!link || link.target === '_blank') return

      const href = link.getAttribute('href')
      if (!href || !href.includes('#')) return

      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname !== pathname) return
      if (!url.hash) return

      event.preventDefault()
      if (url.hash === hash) {
        scrollToHash(url.hash)
        return
      }
      navigate(`${url.pathname}${url.hash}`, { preventScrollReset: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [hash, navigate, pathname])

  return (
    <div className="page">
      <SeoHead />
      <a className="skip-link" href="#top">
        {t.common.skipToContent}
      </a>
      <Navbar />
      <main id="top">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
