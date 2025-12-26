import { useEffect, useRef } from 'react'

export default function useRefEffect<T extends any[]>(refDep: T, fn: (...args: T) => void, dep: any[]) {
  const refCache = useRef(refDep)

  useEffect(() => {
    refCache.current = refDep
  }, refDep)

  useEffect(() => {
    fn(...refCache.current)
  }, dep)
}
