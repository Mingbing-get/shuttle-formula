import type { Computer } from './type'
import type { TokenDesc } from '../../lexicalAnalysis'
import type { ConstSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type CalculateExpression from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { NumberTokenParse, BooleanTokenParse } from '../../lexicalAnalysis'

export default class ConstComputer implements Computer<ConstSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is ConstSyntaxDesc {
    return SyntaxDescUtils.IsConst(ast)
  }

  computed(
    manager: CalculateExpression,
    processId: string,
    ast: ConstSyntaxDesc,
  ) {
    if (ast.constType !== 'string') {
      const firstToken = ast.valueTokens[0]
      if (NumberTokenParse.Is(firstToken) || BooleanTokenParse.Is(firstToken)) {
        return firstToken.value
      }
    } else {
      return this.mergeTokensCode(ast.valueTokens)
    }
  }

  private mergeTokensCode(tokens: Array<TokenDesc<string>>) {
    return tokens.reduce((total, token) => `${total}${token.code}`, '')
  }
}
