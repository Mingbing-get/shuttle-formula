import type { Computer } from './type'
import type { TokenDesc } from '../../lexicalAnalysis'
import type { VariableSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type CalculateExpression from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { DotTokenParse } from '../../lexicalAnalysis'

export default class VariableComputer implements Computer<VariableSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is VariableSyntaxDesc {
    return SyntaxDescUtils.IsVariable(ast)
  }

  async computed(
    manager: CalculateExpression,
    processId: string,
    ast: VariableSyntaxDesc,
  ) {
    const path = this.getPathFromPathTokens(ast.pathTokens)
    const variableValue = await manager.getVariable?.(path)

    return variableValue
  }

  private getPathFromPathTokens(tokens: Array<TokenDesc<string>>) {
    const path: string[] = []

    const saveKey: string[] = []
    for (const token of tokens) {
      if (DotTokenParse.Is(token)) {
        path.push(saveKey.join(''))
        saveKey.length = 0
      } else {
        saveKey.push(token.code)
      }
    }

    if (saveKey.length > 0) {
      path.push(saveKey.join(''))
    }

    return path
  }
}
