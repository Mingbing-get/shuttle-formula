import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type GteTokenType = 'TOKEN_GTE'

export interface GteTokenDesc extends TokenDesc<GteTokenType> {}

export class GteTokenParse extends OperatorBaseParse<GteTokenType> {
  static Type: GteTokenType = 'TOKEN_GTE'

  static Is(token: TokenDesc<string>): token is GteTokenDesc {
    return token.type === GteTokenParse.Type
  }

  constructor() {
    super('>=', GteTokenParse.Type)
  }
}
