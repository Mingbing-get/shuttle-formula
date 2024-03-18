import type {
  SyntaxDesc,
  SyntaxError,
  VariableDefine,
  FunctionDefine,
  WithPromise,
  WithUndefined,
} from 'core'

export type GetVariableDefine = (
  path: string[],
) => WithPromise<WithUndefined<VariableDefine.Desc>>

export type GetFunctionDefine = (
  name: string,
) => WithPromise<WithUndefined<FunctionDefine.Desc>>

export type GetDynamicObjectByPath = (
  path: string[],
  dynamicObjectDefine: WithDynamicVariableObject,
) => WithPromise<
  WithUndefined<VariableDefine.Object | HasDynamicVariableObject>
>

export interface HasDynamicVariableArray extends VariableDefine.Base<'array'> {
  item: WithDynamicVariable
  label?: string
}

export interface HasDynamicVariableObject
  extends VariableDefine.Base<'object'> {
  prototype: Record<string, WithDynamicVariable>
  label?: string
}

export interface WithDynamicVariableObject
  extends VariableDefine.Base<'object'> {
  dynamic: true
  label?: string
  [k: string]: any
}

export type WithDynamicVariable =
  | HasDynamicVariableArray
  | WithDynamicVariableObject
  | HasDynamicVariableObject
  | UnionAddExtra<VariableDefine.Desc, { label?: string }>

export type WithLabelFunction = UnionAddExtra<
  FunctionDefine.Desc,
  { label?: string }
>

export interface FunctionGroup {
  id: string
  label: string
  functions: Record<string, WithLabelFunction>
}

export interface WithTokenError {
  tokenIds: string[]
  syntaxError: SyntaxError.Desc
}

export interface SyntaxAst {
  syntaxRootIds: string[]
  syntaxMap: Record<string, SyntaxDesc<string>>
}

export interface RenderOption {
  code?: string
  useWorker?: boolean
  variables?: Record<string, WithDynamicVariable>
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  getDynamicObjectByPath?: GetDynamicObjectByPath
}

type UnionAddExtra<U, E> = U extends Object
  ? (() => U) extends () => infer R
    ? R & E
    : never
  : never
