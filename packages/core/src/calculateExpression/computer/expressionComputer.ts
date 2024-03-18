import type { Computer } from './type'
import type { ExpressionSyntaxDesc, SyntaxDesc } from '../../syntaxAnalysis'
import type CalculateExpression from '../instance'

import { SyntaxDescUtils } from '../../syntaxAnalysis'
import {
  LeftSmallBracketTokenParse,
  // 二元表达式
  MulTokenParse,
  DivTokenParse,
  ModTokenParse,
  AddTokenParse,
  SubTokenParse,
  EqTokenParse,
  NeqTokenParse,
  GtTokenParse,
  GteTokenParse,
  LtTokenParse,
  LteTokenParse,
  AndTokenParse,
  OrTokenParse,
} from '../../lexicalAnalysis'

export default class ExpressionComputer
  implements Computer<ExpressionSyntaxDesc>
{
  isUse(ast: SyntaxDesc<string>): ast is ExpressionSyntaxDesc {
    return SyntaxDescUtils.IsExpression(ast)
  }

  async computed(
    manager: CalculateExpression,
    processId: string,
    ast: ExpressionSyntaxDesc,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) {
    if (LeftSmallBracketTokenParse.Is(ast.token)) {
      await manager.computedAst(processId, ast.children, syntaxMap)

      return manager.getValue(processId, ast.children[0])
    }

    // 二元表达式
    if (ast.children.length !== 2) {
      throw new Error('二元表达式缺少子节点')
    }
    await manager.computedAst(processId, [ast.children[0]], syntaxMap)
    await manager.computedAst(processId, [ast.children[1]], syntaxMap)

    const firstValue = manager.getValue(processId, ast.children[0])
    const secondValue = manager.getValue(processId, ast.children[1])
    if (MulTokenParse.Is(ast.token)) {
      return firstValue * secondValue
    }
    if (DivTokenParse.Is(ast.token)) {
      return firstValue / secondValue
    }
    if (ModTokenParse.Is(ast.token)) {
      return firstValue % secondValue
    }
    if (AddTokenParse.Is(ast.token)) {
      return firstValue + secondValue
    }
    if (SubTokenParse.Is(ast.token)) {
      return firstValue - secondValue
    }
    if (EqTokenParse.Is(ast.token)) {
      return firstValue === secondValue
    }
    if (NeqTokenParse.Is(ast.token)) {
      return firstValue !== secondValue
    }
    if (GtTokenParse.Is(ast.token)) {
      return firstValue > secondValue
    }
    if (GteTokenParse.Is(ast.token)) {
      return firstValue >= secondValue
    }
    if (LtTokenParse.Is(ast.token)) {
      return firstValue < secondValue
    }
    if (LteTokenParse.Is(ast.token)) {
      return firstValue <= secondValue
    }
    if (AndTokenParse.Is(ast.token)) {
      return firstValue && secondValue
    }
    if (OrTokenParse.Is(ast.token)) {
      return firstValue || secondValue
    }
  }
}
