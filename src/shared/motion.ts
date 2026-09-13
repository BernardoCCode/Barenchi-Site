export const EASE = [0.16, 1, 0.3, 1] as const

export const fadeUp = (delay = 0, distance = 16) => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  },
})
