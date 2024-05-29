import { useEffect, useMemo, useRef } from 'react'
import { Render } from 'render'

import { renderContext } from '.'

import type { RenderOption } from 'render'

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

  useEffect(() => {
    render.current.codeManager.resetCode(options.code ?? '')
  }, [options.code])

  useEffect(() => {
    render.current.updateDisabled(options.disabled)
  }, [options.disabled])

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
