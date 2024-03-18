import type { Checker } from './type'
import type { SyntaxError } from '../type'
import type { FunctionDefine } from '../../type'
import type { TokenDesc } from '../../lexicalAnalysis'
import type { FunctionSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type SyntaxCheck from '../instance'

import FunctionUtils from '../../functionUtils'
import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { CommaTokenParse } from '../../lexicalAnalysis'

export default class FunctionChecker implements Checker<FunctionSyntaxDesc> {
  private manager: SyntaxCheck | undefined

  isUse(ast: SyntaxDesc<string>): ast is FunctionSyntaxDesc {
    return SyntaxDescUtils.IsFunction(ast)
  }

  async check(
    manager: SyntaxCheck,
    processId: string,
    ast: FunctionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    this.manager = manager

    const name = this.getNameFromTokens(ast.nameTokens)
    const functionDef = await manager.getFunctionDefine?.(name)

    if (!functionDef) {
      return manager.createError(
        'undefinedError',
        ast.id,
        `未定义函数：${name}`,
      )
    }

    const checkParams = await this.computedFunctionParamsType(
      processId,
      ast,
      syntaxMap,
    )
    if (checkParams) return checkParams

    const effectParams = ast.params.reduce(
      (total: Array<SyntaxDesc<string>>, item, index) => {
        if (index % 2 === 0) {
          total.push(syntaxMap[item])
        }

        return total
      },
      [],
    )

    const checkParamsType = this.checkFunctionParamsType(
      processId,
      ast.id,
      this.getNameFromTokens(ast.nameTokens),
      effectParams,
      functionDef,
    )
    if (checkParamsType) return checkParamsType

    const functionReturn = await this.getFunctionReturnType(
      processId,
      ast.id,
      this.getNameFromTokens(ast.nameTokens),
      effectParams,
      functionDef.return,
    )

    if (!functionReturn.pass) return functionReturn.error

    manager.setType(processId, ast.id, functionReturn.type)
  }

  private async computedFunctionParamsType(
    processId: string,
    ast: FunctionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    const willComputedParams: Array<SyntaxDesc<string>> = []

    for (const paramsId of ast.params) {
      const paramsAst = syntaxMap[paramsId]
      if (
        SyntaxDescUtils.IsExpression(paramsAst) &&
        CommaTokenParse.Is(paramsAst.token)
      ) {
        const checkParams = await this.checkSingleFunctionParams(
          processId,
          ast,
          willComputedParams,
          syntaxMap,
        )
        if (checkParams) return checkParams

        willComputedParams.length = 0
      } else {
        willComputedParams.push(paramsAst)
      }
    }

    if (willComputedParams.length > 0) {
      return await this.checkSingleFunctionParams(
        processId,
        ast,
        willComputedParams,
        syntaxMap,
      )
    }
  }

  private async checkSingleFunctionParams(
    processId: string,
    ast: FunctionSyntaxDesc,
    willComputedParams: Array<SyntaxDesc<string>>,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    if (willComputedParams.length !== 1) {
      return this.createError(
        'functionError',
        ast.id,
        `函数: ${this.getNameFromTokens(ast.nameTokens)}参数格式错误`,
      )
    }

    return await this.manager?.createSyntaxType(
      processId,
      willComputedParams.map((item) => item.id),
      syntaxMap,
    )
  }

  private checkFunctionParamsType(
    processId: string,
    astId: string,
    functionName: string,
    effectParams: Array<SyntaxDesc<string>>,
    functionDef: FunctionDefine.Desc,
  ) {
    const paramsLength = functionDef.params.length

    if (effectParams.length < paramsLength) {
      return this.createError(
        'functionError',
        astId,
        `函数: ${functionName}缺少参数`,
      )
    }

    const loopAfterParams = Math.floor(
      Math.min(Math.max(functionDef.loopAfterParams ?? 0, 0), paramsLength),
    )
    if (!loopAfterParams && effectParams.length > paramsLength) {
      return this.createError(
        'functionError',
        astId,
        `函数: ${functionName}参数过多`,
      )
    }

    for (let i = 0; i < effectParams.length; i++) {
      const defineParams = this.getCurrentDefineParams(
        processId,
        i,
        loopAfterParams,
        functionDef,
        effectParams,
      )

      const checkRes = this.checkSingleParams(
        processId,
        astId,
        functionName,
        defineParams,
        effectParams[i],
      )

      if (checkRes) {
        return checkRes
      }
    }
  }

  private getCurrentDefineParams(
    processId: string,
    currentIndex: number, // 当前参数位置
    loopAfterCount: number, // 结尾参数重复个数
    functionDef: FunctionDefine.Desc, // 函数定义
    effectParams: Array<SyntaxDesc<string>>, // 当前参数列表
  ): FunctionDefine.Params {
    if (currentIndex < functionDef.params.length) {
      return functionDef.params[currentIndex]
    }

    const overCount =
      (currentIndex - functionDef.params.length) % loopAfterCount
    const defineParamsIndex =
      functionDef.params.length - loopAfterCount + overCount
    const paramsDef = functionDef.params[defineParamsIndex]

    if (
      functionDef.loopParamsMustSameWithFirstWhenForwardInput &&
      FunctionUtils.IsForwardInputParams(paramsDef)
    ) {
      const refParamsType = this.manager?.getType(
        processId,
        effectParams[defineParamsIndex].id,
      )

      if (!refParamsType) {
        throw new Error('解析loopAfterParams出错')
      }

      return {
        define: refParamsType,
      }
    }

    return paramsDef
  }

  private checkSingleParams(
    processId: string,
    astId: string,
    functionName: string,
    paramsDef: FunctionDefine.Params,
    effectParams: SyntaxDesc<string>,
  ) {
    if (FunctionUtils.IsForwardInputParams(paramsDef)) return

    const acceptParams = this.singleOrArrayToArray(paramsDef.define)
    const acceptType = acceptParams.map((item) => item.type)
    const factType = this.manager?.getType(processId, effectParams.id)
    if (!factType?.type || !acceptType.includes(factType.type)) {
      return this.createError(
        'functionError',
        astId,
        `函数: ${functionName}参数类型错误${factType?.type} -> ${acceptType.join(',')}`,
      )
    }
  }

  private async getFunctionReturnType(
    processId: string,
    astId: string,
    functionName: string,
    effectParams: Array<SyntaxDesc<string>>,
    functionReturn: FunctionDefine.Return,
  ): Promise<FunctionDefine.CustomReturnCreateTypeReturn> {
    if (FunctionUtils.IsForwardParamsReturn(functionReturn)) {
      if (effectParams.length <= functionReturn.paramsIndex) {
        return {
          pass: false,
          error: this.createError(
            'functionError',
            astId,
            `函数: ${functionName}参数长度与定义不符`,
          ),
        }
      }

      const returnType = this.manager?.getType(
        processId,
        effectParams[functionReturn.paramsIndex].id,
      )
      if (!returnType) {
        return {
          pass: false,
          error: this.createError(
            'functionError',
            astId,
            `未获取到函数: ${functionName}参数类型`,
          ),
        }
      }

      return {
        pass: true,
        type: returnType,
      }
    }

    if (FunctionUtils.IsForwardParamsArray(functionReturn)) {
      const itemType = await this.getFunctionReturnType(
        processId,
        astId,
        functionName,
        effectParams,
        functionReturn.item,
      )

      if (!itemType.pass) {
        return itemType
      }

      return {
        pass: true,
        type: {
          type: 'array',
          item: itemType.type,
        },
      }
    }

    if (FunctionUtils.IsCustomReturn(functionReturn)) {
      const getType = (id: string) => this.manager?.getType(processId, id)

      return await functionReturn.createType(getType, ...effectParams)
    }

    return {
      pass: true,
      type: functionReturn,
    }
  }

  private singleOrArrayToArray<T>(v: T | T[]) {
    return this.isArray(v) ? v : [v]
  }

  private isArray<T>(v: T | T[]): v is T[] {
    return Object.prototype.toString.call(v) === '[object Array]'
  }

  private getNameFromTokens(tokens: Array<TokenDesc<string>>) {
    return tokens.reduce((total, token) => `${total}${token.code}`, '')
  }

  private createError<T extends SyntaxError.Desc['type']>(
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
}
