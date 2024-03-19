import { inject } from 'vue'
import { Render } from 'render'

export default function useRender(): { render: Render } {
  const render = inject<Render>('render')

  return { render }
}
