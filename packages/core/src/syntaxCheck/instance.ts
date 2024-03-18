import type { SyntaxDesc } from '../syntaxAnalysis'
import type {
  VariableDefine,
  FunctionDefine,
  WithUndefined,
  WithPromise,
} from '../type'
import type { SyntaxError } from './type'
import type { Checker } from './checker'

import { generateId } from '../utils'

type GetVariableDefine = (
  path: string[],
) => WithPromise<WithUndefined<VariableDefine.Desc>>

type GetFunctionDefine = (
  name: string,
) => WithPromise<WithUndefined<FunctionDefine.Desc>>

export default class SyntaxCheck {
  getVariableDefine?: GetVariableDefine
  getFunctionDefine?: GetFunctionDefine

  private readonly checkerList: Checker<any>[] = []
  private readonly typeMap = new Map<string, Map<string, VariableDefine.Desc>>()

  setGetVariableFu(fn: GetVariableDefine) {
    this.getVariableDefine = fn

    return this
  }

  setGetFunctionFu(fn: GetFunctionDefine) {
    this.getFunctionDefine = fn

    return this
  }

  async check(
    rootSyntaxIds: Array<string>,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    const processId = generateId()

    this.typeMap.set(processId, new Map())

    const error = await this.createSyntaxType(
      processId,
      rootSyntaxIds,
      syntaxMap,
    )
    if (error) return error

    const processType = this.typeMap.get(processId)
    this.typeMap.delete(processId)

    return processType as any as Map<string, VariableDefine.Desc>
  }

  async createSyntaxType(
    processId: string,
    rootSyntaxIds: Array<string>,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ): Promise<SyntaxError.Desc | undefined> {
    if (rootSyntaxIds.length > 1) {
      return this.createError(
        'programError',
        rootSyntaxIds[1],
        '当前表达式有多个返回值',
      )
    }

    for (const astId of rootSyntaxIds) {
      const ast = syntaxMap[astId]
      for (const checker of this.checkerList) {
        if (checker.isUse(ast)) {
          const checkRes = await checker.check(this, processId, ast, syntaxMap)
          if (checkRes) return checkRes
        }
      }
    }
  }

  useChecker<T extends SyntaxDesc<string>>(checker: Checker<T>) {
    this.checkerList.push(checker)

    return this
  }

  setType(processId: string, syntaxId: string, type: VariableDefine.Desc) {
    const processType = this.typeMap.get(processId)
    if (!processType) {
      throw new Error(`未找到processType: ${processId}`)
    }

    processType.set(syntaxId, { ...type })
  }

  getType(processId: string, syntaxId: string) {
    const processType = this.typeMap.get(processId)
    if (!processType) {
      throw new Error(`未找到processType: ${processId}`)
    }

    return processType.get(syntaxId)
  }

  createError<T extends SyntaxError.Desc['type']>(
    type: T,
    id: string,
    msg: string,
  ): SyntaxError.Desc {
    return {
      type,
      syntaxId: id,
      msg,
    }
  }

  static MapToObject<T>(map: Map<string, T>) {
    const res: Record<string, T> = {}

    const keys = map.keys()
    let key = keys.next()
    while (!key.done) {
      const v = map.get(key.value)
      if (!v) continue

      res[key.value] = v

      key = keys.next()
    }

    return res
  }
}
