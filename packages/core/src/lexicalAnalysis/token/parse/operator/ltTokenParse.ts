import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type LtTokenType = 'TOKEN_LT'

export interface LtTokenDesc extends TokenDesc<LtTokenType> {}

export class LtTokenParse extends OperatorBaseParse<LtTokenType> {
  static Type: LtTokenType = 'TOKEN_LT'

  static Is(token: TokenDesc<string>): token is LtTokenDesc {
    return token.type === LtTokenParse.Type
  }

  constructor() {
    super('<', LtTokenParse.Type, false)
  }
}
