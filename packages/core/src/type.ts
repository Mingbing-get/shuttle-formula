import type { SyntaxDesc } from './syntaxAnalysis'
import type { SyntaxError } from './syntaxCheck'

export type WithUndefined<T> = T | undefined
export type WithPromise<T> = Promise<T> | T

export namespace VariableDefine {
  export interface Base<T extends string> {
    type: T
  }

  export interface Number extends Base<'number'> {}

  export interface String extends Base<'string'> {}

  export interface Boolean extends Base<'boolean'> {}

  export interface Array extends Base<'array'> {
    item: Desc
  }

  export interface Object extends Base<'object'> {
    prototype: Record<string, Desc>
  }

  export type Desc = Number | String | Boolean | Array | Object
}

export namespace FunctionDefine {
  // params
  type SelfAndArray<T> = T | T[]

  export interface BaseParams {
    define: SelfAndArray<Pick<VariableDefine.Desc, 'type'>>
  }

  export interface ForwardInputParams {
    forwardInput: true
  }

  export type Params = BaseParams | ForwardInputParams

  // return
  export type ConfirmReturn = VariableDefine.Desc

  export interface ForwardParamsReturn {
    scope: 'forwardParams'
    paramsIndex: number
  }

  export interface ForwardParamsArray {
    scope: 'forwardParamsArray'
    item: Return
  }

  export type CustomReturnCreateTypeReturn =
    | {
        pass: true
        type: ConfirmReturn
      }
    | {
        pass: false
        error: SyntaxError.Desc
      }

  export type GetTypeBySyntaxId = (
    id: string,
  ) => WithPromise<WithUndefined<VariableDefine.Desc>>

  export interface CustomReturn {
    scope: 'customReturn'
    createType: (
      getType: GetTypeBySyntaxId,
      ...params: Array<SyntaxDesc<string>>
    ) => WithPromise<CustomReturnCreateTypeReturn>
  }

  export type Return =
    | ConfirmReturn
    | ForwardParamsReturn
    | ForwardParamsArray
    | CustomReturn

  export interface Desc {
    params: Params[]
    loopParamsMustSameWithFirstWhenForwardInput?: boolean
    loopAfterParams?: number
    return: Return
  }
}
