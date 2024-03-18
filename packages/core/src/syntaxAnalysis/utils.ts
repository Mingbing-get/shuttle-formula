import { generateId } from '../utils'
import type { TokenDesc } from '../lexicalAnalysis'

import type {
  SyntaxDesc,
  ExpressionSyntaxDesc,
  VariableSyntaxDesc,
  FunctionSyntaxDesc,
  ConstSyntaxDesc,
  UnknownSyntaxDesc,
} from './type'

export class SyntaxDescUtils {
  static CreateExpression(token: TokenDesc<string>, children: Array<string>) {
    const desc: ExpressionSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'expression',
      token,
      children,
    }

    return desc
  }

  static CreateVariable(
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
  }

  static CreateFunction(
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
  }

  static CreateConst(
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
  }

  static CreateUnknown(token: TokenDesc<string>) {
    const desc: UnknownSyntaxDesc = {
      name: 'syntax',
      id: generateId(),
      type: 'unknown',
      token,
    }

    return desc
  }

  static IsExpression(desc: SyntaxDesc<string>): desc is ExpressionSyntaxDesc {
    return desc.type === 'expression'
  }

  static IsVariable(desc: SyntaxDesc<string>): desc is VariableSyntaxDesc {
    return desc.type === 'variable'
  }

  static IsFunction(desc: SyntaxDesc<string>): desc is FunctionSyntaxDesc {
    return desc.type === 'function'
  }

  static IsConst(desc: SyntaxDesc<string>): desc is ConstSyntaxDesc {
    return desc.type === 'const'
  }

  static IsUnknown(desc: SyntaxDesc<string>): desc is UnknownSyntaxDesc {
    return desc.type === 'unknown'
  }
}
