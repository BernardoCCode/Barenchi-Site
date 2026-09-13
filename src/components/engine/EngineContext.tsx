import { createContext, useContext, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'

export type EngineShared = {
  pointer: MutableRefObject<{ x: number; y: number }>
}

const EngineContext = createContext<EngineShared | null>(null)

export function EngineProvider({ children }: { children: ReactNode }) {
  const pointer = useRef({ x: 0, y: 0 })
  const value = useMemo(() => ({ pointer }), [])
  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>
}

export function useEngine() {
  const ctx = useContext(EngineContext)
  if (!ctx) throw new Error('useEngine must be used inside EngineProvider')
  return ctx
}
