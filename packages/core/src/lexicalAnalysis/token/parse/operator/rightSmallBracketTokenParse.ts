import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type RightSmallBracketTokenType = 'TOKEN_RIGHT_SMALL_BRACKET'

export interface RightSmallBracketTokenDesc
  extends TokenDesc<RightSmallBracketTokenType> {}

export class RightSmallBracketTokenParse extends OperatorBaseParse<RightSmallBracketTokenType> {
  static Type: RightSmallBracketTokenType = 'TOKEN_RIGHT_SMALL_BRACKET'

  static Is(token: TokenDesc<string>): token is RightSmallBracketTokenDesc {
    return token.type === RightSmallBracketTokenParse.Type
  }

  constructor() {
    super(')', RightSmallBracketTokenParse.Type)
  }
}
