import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type OrTokenType = 'TOKEN_OR'

export interface OrTokenDesc extends TokenDesc<OrTokenType> {}

export class OrTokenParse extends OperatorBaseParse<OrTokenType> {
  static Type: OrTokenType = 'TOKEN_OR'

  static Is(token: TokenDesc<string>): token is OrTokenDesc {
    return token.type === OrTokenParse.Type
  }

  constructor() {
    super('||', OrTokenParse.Type)
  }
}
