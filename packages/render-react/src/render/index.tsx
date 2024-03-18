import {
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from 'react'
import { Render } from 'render'

import { useRender } from '../context'

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
