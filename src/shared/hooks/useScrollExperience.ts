import { useLayoutEffect } from 'react'
import { useMediaQuery } from './useMediaQuery'
import { initScrollExperience } from '@/shared/motion/scrollExperience'

export function useScrollExperience(pathname: string) {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')

  useLayoutEffect(() => {
    if (reduce) return
    return initScrollExperience()
  }, [pathname, reduce])
}
