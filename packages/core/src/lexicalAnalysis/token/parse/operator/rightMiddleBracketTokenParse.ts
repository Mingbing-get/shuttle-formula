import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type RightMiddleBracketTokenType = 'TOKEN_RIGHT_MIDDLE_BRACKET'

export interface RightMiddleBracketTokenDesc
  extends TokenDesc<RightMiddleBracketTokenType> {}

export class RightMiddleBracketTokenParse extends OperatorBaseParse<RightMiddleBracketTokenType> {
  static Type: RightMiddleBracketTokenType = 'TOKEN_RIGHT_MIDDLE_BRACKET'

  static Is(token: TokenDesc<string>): token is RightMiddleBracketTokenDesc {
    return token.type === RightMiddleBracketTokenParse.Type
  }

  constructor() {
    super(']', RightMiddleBracketTokenParse.Type)
  }
}
