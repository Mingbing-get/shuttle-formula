import type {
  SyntaxDesc,
  SyntaxError,
  VariableDefine,
  FunctionDefine,
  WithPromise,
  WithUndefined,
} from '@shuttle-formula/core'
import type {
  FunctionGroup,
  WithLabelFunction,
} from '@shuttle-formula/functions'

export type GetVariableDefine = (
  path: string[],
) => WithPromise<WithUndefined<VariableDefine.Desc>>

export type GetVariableDefineWhenDot = (
  startType: VariableDefine.Desc,
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

export type GetDynamicDefineAndValueByPath = (
  path: string[],
  dynamicObjectDefine: WithDynamicVariableObject,
  dynamicValue: any,
) => WithPromise<
  WithUndefined<{
    define: WithUndefined<VariableDefine.Object | HasDynamicVariableObject>
    value: any
  }>
>

export interface HasDynamicVariableArray extends VariableDefine.Base<'array'> {
  item: WithDynamicVariable
  label?: string
}

export interface HasDynamicVariableObject extends VariableDefine.Base<'object'> {
  prototype: Record<string, WithDynamicVariable>
  label?: string
}

export interface WithDynamicVariableObject extends VariableDefine.Base<'object'> {
  dynamic: true
  extra?: any
  label?: string
  [k: string]: any
}

export type WithDynamicVariable =
  | HasDynamicVariableArray
  | WithDynamicVariableObject
  | HasDynamicVariableObject
  | UnionAddExtra<VariableDefine.Desc, { label?: string }>

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
  disabled?: boolean
  variables?: Record<string, WithDynamicVariable>
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  getDynamicObjectByPath?: GetDynamicObjectByPath
}

type UnionAddExtra<U, E> = U extends Object
  ? (() => U) extends () => infer R
    ? R & E
    : never
  : never
