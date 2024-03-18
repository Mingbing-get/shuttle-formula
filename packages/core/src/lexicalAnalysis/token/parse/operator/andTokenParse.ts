import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type AndTokenType = 'TOKEN_AND'

export interface AndTokenDesc extends TokenDesc<AndTokenType> {}

export class AndTokenParse extends OperatorBaseParse<AndTokenType> {
  static Type: AndTokenType = 'TOKEN_AND'

  static Is(token: TokenDesc<string>): token is AndTokenDesc {
    return token.type === AndTokenParse.Type
  }

  constructor() {
    super('&&', AndTokenParse.Type)
  }
}
