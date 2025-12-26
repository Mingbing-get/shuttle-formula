import { useCallback, useEffect, useRef } from 'react'

export default function useEffectCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]) {
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, deps)

  const effectFn = useCallback((...args: Parameters<T>): ReturnType<T> => {
    return fnRef.current(...args)
  }, [])

  return effectFn
}
