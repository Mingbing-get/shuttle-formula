import type { Checker } from './type'
import type { UnknownSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type SyntaxCheck from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'

export default class UnknownChecker implements Checker<UnknownSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is UnknownSyntaxDesc {
    return SyntaxDescUtils.IsUnknown(ast)
  }

  check(manager: SyntaxCheck, processId: string, ast: UnknownSyntaxDesc) {
    return manager.createError(
      'unknownTokenError',
      ast.id,
      `未知关键词：${ast.token.code}`,
    )
  }
}
