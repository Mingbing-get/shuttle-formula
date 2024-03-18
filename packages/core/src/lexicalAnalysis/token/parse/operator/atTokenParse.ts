import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type AtTokenType = 'TOKEN_AT'

export interface AtTokenDesc extends TokenDesc<AtTokenType> {}

export class AtTokenParse extends OperatorBaseParse<AtTokenType> {
  static Type: AtTokenType = 'TOKEN_AT'

  static Is(token: TokenDesc<string>): token is AtTokenDesc {
    return token.type === AtTokenParse.Type
  }

  constructor() {
    super('@', AtTokenParse.Type)
  }
}
