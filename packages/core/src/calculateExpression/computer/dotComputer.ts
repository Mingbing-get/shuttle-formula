import type { Computer } from './type'
import type { TokenDesc } from '../../lexicalAnalysis'
import type { DotSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type CalculateExpression from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { DotTokenParse } from '../../lexicalAnalysis'

export default class DotComputer implements Computer<DotSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is DotSyntaxDesc {
    return SyntaxDescUtils.IsDot(ast)
  }

  async computed(
    manager: CalculateExpression,
    processId: string,
    ast: DotSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    await manager.computedAst(processId, [ast.startSyntaxId], syntaxMap)

    const startValue = manager.getValue(processId, ast.startSyntaxId)
    const path = this.getPathFromPathTokens(ast.pathTokens)

    return this.getValueByPath(startValue, path)
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

  private getValueByPath(value: any, path: string[]): any {
    if (path.length === 0) return value

    if (!value) return undefined

    if (typeof value !== 'object') return undefined

    return this.getValueByPath(value[path[0]], path.slice(1))
  }
}
