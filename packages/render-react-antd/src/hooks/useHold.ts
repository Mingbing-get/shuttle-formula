import { useEffect, useRef, useState } from 'react'

import useEffectCallback from './useEffectCallback'

export default function useHood<T>(value: T, onChange?: (value: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [_value, setValue] = useState(value)
  const preValue = useRef(_value)

  const _onChange = useEffectCallback(
    (value: T) => {
      onChange?.(value)
    },
    [onChange]
  )

  useEffect(() => {
    if (_value === preValue.current) return

    _onChange(_value)
  }, [_value])

  useEffect(() => {
    if (preValue.current === value) return

    preValue.current = value
    setValue(value)
  }, [value])

  return [_value, setValue]
}
