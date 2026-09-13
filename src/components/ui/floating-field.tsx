import { motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

const INSTANT = { duration: 0 } as const
const LIFT = { type: 'spring', stiffness: 760, damping: 46, mass: 0.5 } as const
const RAISE = -30
const SLIDE = -10
const SHRINK = 0.92

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

type UseFloatingLabelOptions = {
  value?: string
  defaultValue?: string
  disabled?: boolean
}

function useFloatingLabel({ value, defaultValue, disabled = false }: UseFloatingLabelOptions = {}) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const mounted = useRef(false)
  const [focused, setFocused] = useState(false)
  const [fill, setFill] = useState({
    length: (value ?? defaultValue ?? '').length,
    instant: true,
  })

  const settle = useCallback((next: number, instant: boolean) => {
    setFill((prev) => (prev.length === next && prev.instant === instant ? prev : { length: next, instant }))
  }, [])

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    const next = value !== undefined ? value.length : el ? el.value.length : 0
    settle(next, !mounted.current)
    mounted.current = true
  }, [value, settle])

  useEffect(() => {
    setFill((prev) => (prev.instant ? { ...prev, instant: false } : prev))
  }, [])

  useEffect(() => {
    if (disabled) setFocused(false)
  }, [disabled])

  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback(() => setFocused(false), [])
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      settle(event.currentTarget.value.length, false),
    [settle],
  )

  return {
    ref,
    raised: focused || fill.length > 0,
    focused,
    length: fill.length,
    instant: fill.instant && !focused,
    fieldProps: { onFocus, onBlur, onChange },
  }
}

type FloatingFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  invalid?: boolean
  icon?: ReactNode
  multiline?: boolean
  rows?: number
  maxLength?: number
} & Pick<
  ComponentPropsWithoutRef<'input'>,
  'name' | 'type' | 'autoComplete' | 'inputMode' | 'required' | 'disabled'
>

export function FloatingField({
  label,
  value,
  onChange,
  hint,
  invalid = false,
  icon,
  multiline = false,
  rows = 5,
  maxLength,
  name,
  type = 'text',
  autoComplete,
  inputMode,
  required,
  disabled,
}: FloatingFieldProps) {
  const auto = useId()
  const fieldId = `${auto}-field`
  const hintId = `${auto}-hint`
  const reduce = useReducedMotion()
  const { ref, raised, focused, length, instant, fieldProps } = useFloatingLabel({ value, disabled })
  const move = reduce || instant ? INSTANT : LIFT

  const sharedProps = {
    id: fieldId,
    name,
    value,
    required,
    disabled,
    'aria-required': required || undefined,
    'aria-invalid': invalid || undefined,
    'aria-describedby': hint ? hintId : undefined,
    onFocus: fieldProps.onFocus,
    onBlur: fieldProps.onBlur,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      fieldProps.onChange(event)
      onChange(event.currentTarget.value)
    },
    className: `floating-field__control${icon ? ' floating-field__control--icon' : ''}`,
  }

  return (
    <div
      className={`floating-field${invalid ? ' floating-field--invalid' : ''}${focused ? ' floating-field--focused' : ''}${raised ? ' floating-field--raised' : ''}${multiline ? ' floating-field--multiline' : ''}`}
    >
      <div className="floating-field__shell">
        {icon ? <span className="floating-field__icon">{icon}</span> : null}
        {multiline ? (
          <textarea {...sharedProps} ref={ref as React.RefObject<HTMLTextAreaElement>} rows={rows} maxLength={maxLength} />
        ) : (
          <input
            {...sharedProps}
            ref={ref as React.RefObject<HTMLInputElement>}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
          />
        )}
        <motion.label
          htmlFor={fieldId}
          initial={false}
          animate={{ y: raised ? RAISE : 0, x: raised ? SLIDE : 0, scale: raised ? SHRINK : 1 }}
          transition={move}
          style={{ originX: 0, originY: 0 }}
          className="floating-field__label"
        >
          {label}
          {required ? <span aria-hidden> *</span> : null}
        </motion.label>
        <span className={`floating-field__glow${focused ? ' is-on' : ''}`} aria-hidden />
      </div>
      <div className="floating-field__meta">
        {hint ? (
          <p id={hintId} className="floating-field__hint">
            {hint}
          </p>
        ) : null}
        {maxLength !== undefined ? (
          <span className="floating-field__count" aria-hidden>
            {length} / {maxLength}
          </span>
        ) : null}
      </div>
    </div>
  )
}
