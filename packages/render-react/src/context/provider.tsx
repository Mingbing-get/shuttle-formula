import { useEffect, useMemo, useRef } from 'react'
import { Render, RenderOption } from 'render'

import { renderContext } from '.'

interface Props extends RenderOption {
  children?: React.ReactNode
}

export default function Provider({ children, ...options }: Props) {
  const render = useRef(new Render(options))

  useEffect(() => {
    if (!options.functions) return

    render.current.setFunctions(options.functions)
  }, [options.functions])

  useEffect(() => {
    if (!options.variables) return

    render.current.setVariables(options.variables)
  }, [options.variables])

  useEffect(() => {
    if (!options.getDynamicObjectByPath) return

    render.current.setGetDynamicObjectByPath(options.getDynamicObjectByPath)
  }, [options.getDynamicObjectByPath])

  const contextValue = useMemo(
    () => ({
      render: render.current,
    }),
    [],
  )

  return (
    <renderContext.Provider value={contextValue}>
      {children}
    </renderContext.Provider>
  )
}
