import type { Checker } from './type'
import type { DotSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type { TokenDesc } from '../../lexicalAnalysis'
import type SyntaxCheck from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import { DotTokenParse } from '../../lexicalAnalysis'

export default class DotChecker implements Checker<DotSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is DotSyntaxDesc {
    return SyntaxDescUtils.IsDot(ast)
  }

  async check(
    manager: SyntaxCheck,
    processId: string,
    ast: DotSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    const { pass, path } = this.getPathFromPathTokens(ast.pathTokens)
    if (!pass) {
      return manager.createError(
        'variablePathError',
        ast.id,
        '变量路径格式错误',
      )
    }

    const startDef = await manager.createSyntaxType(
      processId,
      [ast.startSyntaxId],
      syntaxMap,
    )
    if (startDef) {
      return startDef
    }

    const startType = manager.getType(processId, ast.startSyntaxId)
    if (!startType) {
      return manager.createError(
        'operatorError',
        ast.id,
        '未获取到起始节点的类型',
      )
    }

    const dotDef = await manager.getVariableDefineWhenDot(startType, path)
    if (!dotDef) {
      return manager.createError('variablePathError', ast.id, '变量路径不存在')
    }

    manager.setType(processId, ast.id, dotDef)
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
        pass: true,
        path,
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
