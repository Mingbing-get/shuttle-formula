import type { Computer } from './type'
import type { TokenDesc } from '../../lexicalAnalysis'
import type { FunctionSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type CalculateExpression from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { CommaTokenParse } from '../../lexicalAnalysis'

export default class FunctionComputer implements Computer<FunctionSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is FunctionSyntaxDesc {
    return SyntaxDescUtils.IsFunction(ast)
  }

  async computed(
    manager: CalculateExpression,
    processId: string,
    ast: FunctionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    const name = this.mergeTokensCode(ast.nameTokens)
    const functionDef = await manager.getFunction?.(name)

    const params = await this.computedFunctionParamsValue(
      manager,
      processId,
      ast,
      syntaxMap,
    )

    // eslint-disable-next-line
    const functionValue = await functionDef?.(...params)

    return functionValue
  }

  private async computedFunctionParamsValue(
    manager: CalculateExpression,
    processId: string,
    ast: FunctionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    const willComputedParams: Array<string> = []
    const paramsValues: any[] = []

    for (const paramsId of ast.params) {
      const paramsAst = syntaxMap[paramsId]

      if (
        SyntaxDescUtils.IsExpression(paramsAst) &&
        CommaTokenParse.Is(paramsAst.token)
      ) {
        await manager.computedAst(processId, willComputedParams, syntaxMap)

        paramsValues.push(manager.getValue(processId, willComputedParams[0]))
        willComputedParams.length = 0
      } else {
        willComputedParams.push(paramsId)
      }
    }

    if (willComputedParams.length > 0) {
      await manager.computedAst(processId, willComputedParams, syntaxMap)
      paramsValues.push(manager.getValue(processId, willComputedParams[0]))
    }

    return paramsValues
  }

  private mergeTokensCode(tokens: Array<TokenDesc<string>>) {
    return tokens.reduce((total, token) => `${total}${token.code}`, '')
  }
}
