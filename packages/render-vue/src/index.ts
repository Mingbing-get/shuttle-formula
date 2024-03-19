export { default as Provider } from './context/provider.vue'
export { default as Render } from './render/index.vue'

export { default as useRender } from './context/useRender'

export { default as ErrorRender } from './errorRender/index.vue'
export { default as TokenRender } from './tokenRender/index.vue'
export { default as FunctionTip } from './tipRender/functionTip.vue'
export { default as VariableTip } from './tipRender/variableTip.vue'

export type {
  ErrorRenderComponent,
  ErrorRenderComponentProps,
} from './errorRender/type'

export type { TokenRenderComponent, TokenRenderProps } from './tokenRender/type'
export type {
  FunctionSelectComponent,
  FunctionSelectProps,
  VariableSelectComponent,
  VariableSelectProps,
} from './tipRender/type'
