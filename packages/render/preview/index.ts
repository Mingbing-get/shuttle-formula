import { Render } from '../src'

import { vars, functionWithGroups, getDynamicObjectByPath } from './mock'

const render = new Render({
  useWorker: true,
  variables: vars,
  functions: functionWithGroups,
  getDynamicObjectByPath,
})

render.setDomStyle(
  'border-radius: 5px; box-shadow: 0 0 6px 0 #ccc; width: 400px',
)

const root = document.createElement('div')
root.setAttribute('style', 'display: flex; justify-content: center;')
render.mount(root)

document.body.append(root)
