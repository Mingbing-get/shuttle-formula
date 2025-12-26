import { generateId } from '../utils'
import type { TokenDesc } from '../lexicalAnalysis'

import type {
  SyntaxDesc,
  ExpressionSyntaxDesc,
  VariableSyntaxDesc,
  DotSyntaxDesc,
  FunctionSyntaxDesc,
  ConstSyntaxDesc,
  UnknownSyntaxDesc,
} from './type'

export const SyntaxDescUtils = {
  CreateExpression(token: TokenDesc<string>, children: Array<string>) {
    const desc: ExpressionSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'expression',
      token,
      children,
    }

    return desc
  },

  CreateVariable(
    triggerToken: TokenDesc<string>,
    pathTokens: Array<TokenDesc<string>>,
  ) {
    const desc: VariableSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'variable',
      triggerToken,
      pathTokens,
    }

    return desc
  },

  CreateDot(
    startSyntaxId: string,
    triggerToken: TokenDesc<string>,
    pathTokens: Array<TokenDesc<string>>,
  ) {
    const desc: DotSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'dot',
      startSyntaxId,
      triggerToken,
      pathTokens,
    }

    return desc
  },

  CreateFunction(
    triggerToken: TokenDesc<string>,
    nameTokens: Array<TokenDesc<string>>,
    params: Array<string>,
  ) {
    const desc: FunctionSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'function',
      triggerToken,
      nameTokens,
      params,
    }

    return desc
  },

  CreateConst(
    valueTokens: Array<TokenDesc<string>>,
    constType: ConstSyntaxDesc['constType'],
  ) {
    const desc: ConstSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'const',
      valueTokens,
      constType,
    }

    return desc
  },

  CreateUnknown(token: TokenDesc<string>) {
    const desc: UnknownSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'unknown',
      token,
    }

    return desc
  },

  IsExpression(desc: SyntaxDesc<string>): desc is ExpressionSyntaxDesc {
    return desc.type === 'expression'
  },

  IsVariable(desc: SyntaxDesc<string>): desc is VariableSyntaxDesc {
    return desc.type === 'variable'
  },

  IsDot(desc: SyntaxDesc<string>): desc is DotSyntaxDesc {
    return desc.type === 'dot'
  },

  IsFunction(desc: SyntaxDesc<string>): desc is FunctionSyntaxDesc {
    return desc.type === 'function'
  },

  IsConst(desc: SyntaxDesc<string>): desc is ConstSyntaxDesc {
    return desc.type === 'const'
  },

  IsUnknown(desc: SyntaxDesc<string>): desc is UnknownSyntaxDesc {
    return desc.type === 'unknown'
  },
}
