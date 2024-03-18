import type { Checker } from './type'
import type { SyntaxDesc, VariableSyntaxDesc } from '../../syntaxAnalysis'
import type { TokenDesc } from '../../lexicalAnalysis'
import type SyntaxCheck from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { DotTokenParse } from '../../lexicalAnalysis'

export default class VariableChecker implements Checker<VariableSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is VariableSyntaxDesc {
    return SyntaxDescUtils.IsVariable(ast)
  }

  async check(
    manager: SyntaxCheck,
    processId: string,
    ast: VariableSyntaxDesc,
  ) {
    const { pass, path } = this.getPathFromPathTokens(ast.pathTokens)
    if (!pass || path.length === 0) {
      return manager.createError(
        'variablePathError',
        ast.id,
        '变量路径格式错误',
      )
    }

    const variableDef = await manager.getVariableDefine?.(path)
    if (!variableDef) {
      return manager.createError(
        'undefinedError',
        ast.id,
        `未定义变量：${path.join('.')}`,
      )
    }

    manager.setType(processId, ast.id, variableDef)
  }

  private getPathFromPathTokens(tokens: Array<TokenDesc<string>>) {
    const path: string[] = []

    const saveKey: string[] = []
    for (const token of tokens) {
      if (DotTokenParse.Is(token)) {
        if (saveKey.length === 0) {
          return {
            pass: false,
            path: [],
          }
        }

        path.push(saveKey.join(''))
        saveKey.length = 0
      } else {
        saveKey.push(token.code)
      }
    }

    if (saveKey.length === 0) {
      return {
        pass: false,
        path: [],
      }
    } else {
      path.push(saveKey.join(''))
    }

    return {
      pass: true,
      path,
    }
  }
}
