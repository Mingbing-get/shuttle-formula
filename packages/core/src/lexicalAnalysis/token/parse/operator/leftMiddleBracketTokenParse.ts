import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type LeftMiddleBracketTokenType = 'TOKEN_LEFT_MIDDLE_BRACKET'

export interface LeftMiddleBracketTokenDesc
  extends TokenDesc<LeftMiddleBracketTokenType> {}

export class LeftMiddleBracketTokenParse extends OperatorBaseParse<LeftMiddleBracketTokenType> {
  static Type: LeftMiddleBracketTokenType = 'TOKEN_LEFT_MIDDLE_BRACKET'

  static Is(token: TokenDesc<string>): token is LeftMiddleBracketTokenDesc {
    return token.type === LeftMiddleBracketTokenParse.Type
  }

  constructor() {
    super('[', LeftMiddleBracketTokenParse.Type)
  }
}
