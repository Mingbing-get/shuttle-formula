import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type GtTokenType = 'TOKEN_GT'

export interface GtTokenDesc extends TokenDesc<GtTokenType> {}

export class GtTokenParse extends OperatorBaseParse<GtTokenType> {
  static Type: GtTokenType = 'TOKEN_GT'

  static Is(token: TokenDesc<string>): token is GtTokenDesc {
    return token.type === GtTokenParse.Type
  }

  constructor() {
    super('>', GtTokenParse.Type, false)
  }
}
