import type { Checker } from './type'
import type { ConstSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type SyntaxCheck from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'

export default class ConstChecker implements Checker<ConstSyntaxDesc> {
  isUse(ast: SyntaxDesc<string>): ast is ConstSyntaxDesc {
    return SyntaxDescUtils.IsConst(ast)
  }

  check(manager: SyntaxCheck, processId: string, ast: ConstSyntaxDesc) {
    manager.setType(processId, ast.id, { type: ast.constType })
  }
}
