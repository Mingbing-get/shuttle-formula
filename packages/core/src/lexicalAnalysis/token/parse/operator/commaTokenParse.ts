import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type CommaTokenType = 'TOKEN_COMMA'

export interface CommaTokenDesc extends TokenDesc<CommaTokenType> {}

export class CommaTokenParse extends OperatorBaseParse<CommaTokenType> {
  static Type: CommaTokenType = 'TOKEN_COMMA'

  static Is(token: TokenDesc<string>): token is CommaTokenDesc {
    return token.type === CommaTokenParse.Type
  }

  constructor() {
    super(',', CommaTokenParse.Type)
  }
}
