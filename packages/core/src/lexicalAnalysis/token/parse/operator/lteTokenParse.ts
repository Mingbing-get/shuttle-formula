import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type LteTokenType = 'TOKEN_LTE'

export interface LteTokenDesc extends TokenDesc<LteTokenType> {}

export class LteTokenParse extends OperatorBaseParse<LteTokenType> {
  static Type: LteTokenType = 'TOKEN_LTE'

  static Is(token: TokenDesc<string>): token is LteTokenDesc {
    return token.type === LteTokenParse.Type
  }

  constructor() {
    super('<=', LteTokenParse.Type)
  }
}
