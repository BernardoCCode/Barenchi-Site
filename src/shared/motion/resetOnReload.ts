export function isReloadNavigation() {
  const entry = performance.getEntriesByType('navigation')[0]
  return entry instanceof PerformanceNavigationTiming && entry.type === 'reload'
}

export function resetToHomeOnReload() {
  if (!isReloadNavigation()) return false

  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual'
  }

  const url = window.location.pathname + window.location.search + window.location.hash
  if (url !== '/') {
    window.history.replaceState(window.history.state, '', '/')
  }

  window.scrollTo(0, 0)
  return true
}
