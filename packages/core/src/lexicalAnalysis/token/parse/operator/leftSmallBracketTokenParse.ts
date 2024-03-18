import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type LeftSmallBracketTokenType = 'TOKEN_LEFT_SMALL_BRACKET'

export interface LeftSmallBracketTokenDesc
  extends TokenDesc<LeftSmallBracketTokenType> {}

export class LeftSmallBracketTokenParse extends OperatorBaseParse<LeftSmallBracketTokenType> {
  static Type: LeftSmallBracketTokenType = 'TOKEN_LEFT_SMALL_BRACKET'

  static Is(token: TokenDesc<string>): token is LeftSmallBracketTokenDesc {
    return token.type === LeftSmallBracketTokenParse.Type
  }

  constructor() {
    super('(', LeftSmallBracketTokenParse.Type)
  }
}
