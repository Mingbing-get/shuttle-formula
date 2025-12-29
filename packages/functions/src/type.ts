import { FunctionDefine } from '@shuttle-formula/core'

export interface FunctionDescriptionExample {
  tip?: string
  params: string[]
  result: string
}

export interface FunctionDescriptionDefine {
  paramsList: string[]
  result: string
}

export interface FunctionDescription {
  define: FunctionDescriptionDefine
  detail: string
  examples: FunctionDescriptionExample[]
}

export type WithLabelFunction<T = any> = UnionAddExtra<
  FunctionDefine.Desc,
  { label?: string; description?: T }
>

export interface FunctionGroup<T = any> {
  id: string
  label: string
  functions: Record<string, WithLabelFunction<T>>
}

type UnionAddExtra<U, E> = U extends Object
  ? (() => U) extends () => infer R
    ? R & E
    : never
  : never
