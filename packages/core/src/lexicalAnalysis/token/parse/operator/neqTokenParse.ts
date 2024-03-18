import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type NeqTokenType = 'TOKEN_NEQ'

export interface NeqTokenDesc extends TokenDesc<NeqTokenType> {}

export class NeqTokenParse extends OperatorBaseParse<NeqTokenType> {
  static Type: NeqTokenType = 'TOKEN_NEQ'

  static Is(token: TokenDesc<string>): token is NeqTokenDesc {
    return token.type === NeqTokenParse.Type
  }

  constructor() {
    super('!=', NeqTokenParse.Type)
  }
}
