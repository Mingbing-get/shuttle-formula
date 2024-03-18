import { createContext, useContext } from 'react'
import { Render } from 'render'

export const renderContext = createContext<{ render: Render }>({
  render: new Render(),
})

export function useRender() {
  return useContext(renderContext)
}
