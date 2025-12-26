import type { Checker } from './type'
import type { ExpressionSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type { TokenDesc } from '../../lexicalAnalysis'
import type SyntaxCheck from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import {
  AddTokenParse,
  AndTokenParse,
  DivTokenParse,
  EqTokenParse,
  LeftSmallBracketTokenParse,
  ModTokenParse,
  MulTokenParse,
  NeqTokenParse,
  OrTokenParse,
  SubTokenParse,
} from '../../lexicalAnalysis'

export default class ExpressionChecker
  implements Checker<ExpressionSyntaxDesc>
{
  isUse(ast: SyntaxDesc<string>): ast is ExpressionSyntaxDesc {
    return SyntaxDescUtils.IsExpression(ast)
  }

  async check(
    manager: SyntaxCheck,
    processId: string,
    ast: ExpressionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    if (LeftSmallBracketTokenParse.Is(ast.token)) {
      const checkChildren = await manager.createSyntaxType(
        processId,
        ast.children,
        syntaxMap,
      )
      if (checkChildren) {
        return checkChildren
      }

      const childType =
        ast.children.length > 0
          ? manager.getType(processId, ast.children[0])
          : undefined

      if (!childType) {
        return manager.createError(
          'operatorError',
          ast.id,
          '未获取到子节点的类型',
        )
      }

      manager.setType(processId, ast.id, childType)
      return
    }

    // 检查二元表达式
    if (ast.children.length !== 2) {
      return manager.createError(
        'operatorError',
        ast.id,
        `运算符: ${ast.token.code} 需要两个子节点`,
      )
    }

    const checkFirstChild = await manager.createSyntaxType(
      processId,
      [ast.children[0]],
      syntaxMap,
    )
    const checkSecondChild = await manager.createSyntaxType(
      processId,
      [ast.children[1]],
      syntaxMap,
    )

    if (checkFirstChild ?? checkSecondChild) {
      return checkFirstChild ?? checkSecondChild
    }

    const firstChildType = manager.getType(processId, ast.children[0])
    const secondChildType = manager.getType(processId, ast.children[1])
    if (!firstChildType || !secondChildType) {
      return manager.createError(
        'operatorError',
        ast.id,
        '未获取到子节点的类型',
      )
    }

    if (firstChildType.type !== secondChildType.type) {
      return manager.createError('operatorError', ast.id, '子节点类型不同')
    }

    if (this.canAcceptBoolean(ast.token)) {
      if (firstChildType.type !== 'boolean') {
        return manager.createError(
          'operatorError',
          ast.id,
          `运算符: ${ast.token.code} 只接受boolean类型`,
        )
      }
    } else if (this.canAcceptBooleanOrNumberOrString(ast.token)) {
      if (!['boolean', 'number', 'string'].includes(firstChildType.type)) {
        return manager.createError(
          'operatorError',
          ast.id,
          `运算符: ${ast.token.code} 只接受boolean、number、string类型`,
        )
      }
    } else if (firstChildType.type !== 'number') {
      return manager.createError(
        'operatorError',
        ast.id,
        `运算符: ${ast.token.code} 只接受number类型`,
      )
    }

    if (this.computedResultIsNumber(ast.token)) {
      manager.setType(processId, ast.id, { type: 'number' })
    } else {
      manager.setType(processId, ast.id, { type: 'boolean' })
    }
  }

  private canAcceptBoolean(token: TokenDesc<string>) {
    return AndTokenParse.Is(token) || OrTokenParse.Is(token)
  }

  private canAcceptBooleanOrNumberOrString(token: TokenDesc<string>) {
    return EqTokenParse.Is(token) || NeqTokenParse.Is(token)
  }

  private computedResultIsNumber(token: TokenDesc<string>) {
    return (
      AddTokenParse.Is(token) ||
      SubTokenParse.Is(token) ||
      MulTokenParse.Is(token) ||
      DivTokenParse.Is(token) ||
      ModTokenParse.Is(token)
    )
  }
}
