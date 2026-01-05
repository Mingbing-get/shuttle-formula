import {
  HasDynamicVariableObject,
  WithDynamicVariable,
} from '@shuttle-formula/render'
import {
  VariableDefine,
  WithPromise,
  WithUndefined,
} from '@shuttle-formula/core'

export namespace VariablePlugin {
  export interface BaseDefine<T extends string> {
    type: T
    label?: string
  }

  export interface BooleanDefine extends BaseDefine<'boolean'> {}

  export interface NumberDefine extends BaseDefine<'number'> {}

  export interface StringDefine extends BaseDefine<'string'> {}

  export interface DateDefine extends BaseDefine<'date'> {}

  export interface DateTimeDefine extends BaseDefine<'datetime'> {}

  export interface ArrayDefine extends BaseDefine<'array'> {
    item: Define
  }

  export interface ObjectDefine extends BaseDefine<'object'> {
    prototype: Record<string, Define>
  }

  export interface DefineMap {
    boolean: BooleanDefine
    number: NumberDefine
    string: StringDefine
    date: DateDefine
    datetime: DateTimeDefine
    array: ArrayDefine
    object: ObjectDefine
  }

  export type Define = DefineMap[keyof DefineMap]

  export type DefineType = Define['type']

  export interface Instance<T extends Define> {
    is(define: Define): define is T
    toFormula(define: T): WithDynamicVariable
    accept: (returnType: WithDynamicVariable, define: T) => boolean
    onDynamicDefine?: (
      define: T,
    ) => WithPromise<
      WithUndefined<VariableDefine.Object | HasDynamicVariableObject>
    >
    onDynamicValue?: (
      define: T,
      originValue: any,
    ) => WithPromise<WithUndefined<any>>
  }
}
