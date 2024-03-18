import type { WithUndefined, WithPromise } from '../type'
import type { SyntaxDesc } from '../syntaxAnalysis'
import type { Computer } from './computer/type'

import { generateId } from '../utils'

type GetVariable = (path: string[]) => WithPromise<WithUndefined<any>>

type GetFunction = (name: string) => WithPromise<WithUndefined<Function>>

export default class CalculateExpression {
  getVariable?: GetVariable
  getFunction?: GetFunction

  private readonly computerList: Computer<any>[] = []
  private readonly valueMap = new Map<string, Map<string, any>>()

  setGetVariableFu(fn: GetVariable) {
    this.getVariable = fn

    return this
  }

  setGetFunctionFu(fn: GetFunction) {
    this.getFunction = fn

    return this
  }

  async execute(
    syntaxRootIds: Array<string>,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    if (syntaxRootIds.length === 0) return

    const processId = generateId()

    this.valueMap.set(processId, new Map())

    await this.computedAst(processId, syntaxRootIds, syntaxMap)

    const processValue = this.valueMap.get(processId)
    this.valueMap.delete(processId)

    return processValue?.get(syntaxRootIds[0])
  }

  async computedAst(
    processId: string,
    syntaxRootIds: Array<string>,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    if (syntaxRootIds.length > 1) {
      throw new Error('当前表达式有多个返回值')
    }

    for (const syntaxId of syntaxRootIds) {
      const ast = syntaxMap[syntaxId]

      for (const computer of this.computerList) {
        if (computer.isUse(ast)) {
          const value = await computer.computed(this, processId, ast, syntaxMap)
          this.saveValue(processId, ast.id, value)
          break
        }
      }
    }
  }

  useComputer<T extends SyntaxDesc<string>>(computer: Computer<T>) {
    this.computerList.push(computer)

    return this
  }

  private saveValue(processId: string, astId: string, value: any) {
    const processValue = this.valueMap.get(processId)
    if (!processValue) {
      throw new Error(`未找到processValue: ${processId}`)
    }

    processValue.set(astId, value)
  }

  getValue(processId: string, astId: string) {
    const processValue = this.valueMap.get(processId)
    if (!processValue) {
      throw new Error(`未找到processValue: ${processId}`)
    }

    return processValue.get(astId)
  }
}
