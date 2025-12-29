import { inject } from 'vue'
import type { Render } from '@shuttle-formula/render'

export default function useRender(): { render: Render } {
  // eslint-disable-next-line
  const render = inject<Render>('render')!

  return { render }
}
