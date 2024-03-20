import { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react'

import { useRender } from '../context'

import type { Render } from 'render'
import type { ForwardedRef } from 'react'

interface Props {
  style?: React.CSSProperties
  className?: string
}

function RenderUseReact(
  { style, className }: Props,
  ref?: ForwardedRef<Render>,
) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { render } = useRender()

  useImperativeHandle(ref, () => render, [])

  useLayoutEffect(() => {
    if (!wrapperRef.current) return

    render.mount(wrapperRef.current)
  }, [])

  return (
    <div
      style={{ display: 'flex', ...style }}
      className={className}
      ref={wrapperRef}
    />
  )
}

export default forwardRef(RenderUseReact)
