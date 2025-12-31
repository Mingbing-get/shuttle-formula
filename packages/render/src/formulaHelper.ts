import {
  LexicalAnalysis,
  useAllTokenParse,
  SyntaxAnalysis,
  CalculateExpression,
  useAllComputer,
  SyntaxCheck,
  useAllChecker,
  VariableDefine,
} from '@shuttle-formula/core'
import { FunctionGroup, WithLabelFunction } from '@shuttle-formula/functions'

import {
  WithDynamicVariable,
  GetDynamicObjectByPath,
  WithDynamicVariableObject,
} from './type'

export interface CustomComputedOptions {
  function?: Record<string, Function>
  getVariableValueByPath: (path: string[]) => Promise<any> | any
}

export interface InnerComputedOptions {
  function?: Record<string, Function>
  variable: Record<string, any>
  variableDefine: Record<string, WithDynamicVariable>
  getDynamicObjectByPath?: GetDynamicObjectByPath
}

export type ComputedOptions = CustomComputedOptions | InnerComputedOptions

export interface GetDependceOptions {
  variableDefine?: Record<string, WithDynamicVariable>
  functionDefine?: Record<string, WithLabelFunction> | FunctionGroup[]
  getDynamicObjectByPath?: GetDynamicObjectByPath
}

export class FormulaHelper {
  private code: string
  readonly lexicalAnalysis: LexicalAnalysis
  readonly syntaxAnalysis: SyntaxAnalysis
  readonly syntaxCheck: SyntaxCheck
  readonly calculateExpression: CalculateExpression

  constructor(code: string) {
    this.code = code

    this.lexicalAnalysis = new LexicalAnalysis()
    useAllTokenParse(this.lexicalAnalysis)

    this.syntaxAnalysis = new SyntaxAnalysis()

    this.syntaxCheck = new SyntaxCheck()
    useAllChecker(this.syntaxCheck)

    this.calculateExpression = new CalculateExpression()
    useAllComputer(this.calculateExpression)
  }

  setCode(code: string) {
    this.code = code

    return this
  }

  async computed(options: ComputedOptions) {
    this.calculateExpression.setGetVariableFu(async (path) => {
      if (this.isCustomComputedOptions(options)) {
        return await options.getVariableValueByPath(path)
      } else {
        return await this.getVariableValueByPath(
          path,
          options.variableDefine,
          options.variable,
          options.getDynamicObjectByPath,
        )
      }
    })
    this.calculateExpression.setGetFunctionFu(
      (functionName) => options.function?.[functionName],
    )

    // 计算
    this.lexicalAnalysis.setCode(this.code)
    const tokens = await this.lexicalAnalysis.execute()

    this.syntaxAnalysis.setTokenDesc(tokens)
    const ast = await this.syntaxAnalysis.execute()

    const result = await this.calculateExpression.execute(
      ast.syntaxRootIds,
      ast.syntaxMap,
    )

    return result
  }

  async getDependceAndCheck(options: GetDependceOptions) {
    const variableDependce: {
      path: string[]
      fromDot?: boolean
      variableDefine: VariableDefine.Desc
    }[] = []
    const functionDependce: {
      functionName: string
      functionDefine: WithLabelFunction
    }[] = []

    this.syntaxCheck.setGetVariableFu(async (path) => {
      const variableDefine = await this.getVariableDefineByPath(
        path,
        options.variableDefine || {},
        options.getDynamicObjectByPath,
      )

      if (variableDefine) {
        variableDependce.push({
          path,
          variableDefine,
        })
      }

      return variableDefine
    })
    this.syntaxCheck.setGetFunctionFu((functionName) => {
      if (!options.functionDefine) {
        return
      }

      if (Array.isArray(options.functionDefine)) {
        for (const group of options.functionDefine) {
          const functionDefine = group.functions[functionName]
          if (functionDefine) {
            functionDependce.push({
              functionName,
              functionDefine,
            })
            return functionDefine
          }
        }
      } else {
        const functionDefine = options.functionDefine[functionName]
        if (functionDefine) {
          functionDependce.push({
            functionName,
            functionDefine,
          })
        }
        return functionDefine
      }
    })
    this.syntaxCheck.setGetVariableDefineWhenDot(async (startType, path) => {
      if (path.length === 0) return startType

      const variableDefine = await this.getVariableDefineByPath(
        ['_', ...path],
        {
          _: startType,
        },
        options.getDynamicObjectByPath,
      )

      if (variableDefine) {
        variableDependce.push({
          path,
          fromDot: true,
          variableDefine,
        })
      }

      return variableDefine
    })

    this.lexicalAnalysis.setCode(this.code)
    const tokens = await this.lexicalAnalysis.execute()

    this.syntaxAnalysis.setTokenDesc(tokens)
    const ast = await this.syntaxAnalysis.execute()

    const res = await this.syntaxCheck.check(ast.syntaxRootIds, ast.syntaxMap)

    return {
      variableDependce,
      functionDependce,
      error: res instanceof Map ? undefined : res,
    }
  }

  private async getVariableDefineByPath(
    path: string[],
    variableDefine: Record<string, WithDynamicVariable>,
    getDynamicObjectByPath?: GetDynamicObjectByPath,
  ): Promise<VariableDefine.Desc | undefined> {
    if (path.length === 0) return

    let currentDefine = variableDefine[path[0]]
    if (!currentDefine || path.length === 1) {
      return currentDefine as VariableDefine.Desc
    }

    let nextVariableDefine: Record<string, WithDynamicVariable> | undefined
    if (currentDefine.type === 'array') {
      nextVariableDefine = {
        [path[1]]: currentDefine.item,
      }
    }

    if (this.isWithDynamicObject(currentDefine)) {
      const dynamicVariable = await getDynamicObjectByPath?.(
        path.slice(1),
        currentDefine,
      )
      if (!dynamicVariable) return

      currentDefine = dynamicVariable
    }

    if (currentDefine.type === 'object') {
      nextVariableDefine = currentDefine.prototype
    }

    if (!nextVariableDefine) return

    return await this.getVariableDefineByPath(
      path.slice(1),
      nextVariableDefine,
      getDynamicObjectByPath,
    )
  }

  private async getVariableValueByPath(
    path: string[],
    variableDefine: Record<string, WithDynamicVariable>,
    variable?: Record<string, any>,
    getDynamicObjectByPath?: GetDynamicObjectByPath,
  ): Promise<any> {
    if (path.length === 0 || !variable) return

    let value = variable[path[0]]
    if (path.length === 1) {
      return value
    }

    let currentDefine = variableDefine[path[0]]
    if (!currentDefine) return

    let leftPath = path.slice(1)
    if (currentDefine.type === 'array') {
      const nextKey = Number(path[1])
      if (isNaN(nextKey) || !(value instanceof Array)) return

      value = value[nextKey]
      if (path.length === 2) {
        return value
      }

      leftPath = path.slice(2)
    }

    if (currentDefine.type === 'array') {
      currentDefine = currentDefine.item
    }

    if (this.isWithDynamicObject(currentDefine)) {
      const dynamicVariable = await getDynamicObjectByPath?.(
        leftPath,
        currentDefine,
      )
      if (!dynamicVariable) return

      currentDefine = dynamicVariable
    }

    if (currentDefine.type === 'object') {
      return await this.getVariableValueByPath(
        leftPath,
        currentDefine.prototype,
        value,
        getDynamicObjectByPath,
      )
    }
  }

  private isWithDynamicObject(
    variable: WithDynamicVariable,
  ): variable is WithDynamicVariableObject {
    return (
      variable.type === 'object' &&
      !(variable as any).prototype &&
      (variable as any).dynamic
    )
  }

  private isCustomComputedOptions(
    options: ComputedOptions,
  ): options is CustomComputedOptions {
    return typeof (options as any).getVariableValueByPath === 'function'
  }
}
