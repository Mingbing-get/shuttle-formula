import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type DotTokenType = 'TOKEN_DOT'

export interface DotTokenDesc extends TokenDesc<DotTokenType> {}

export class DotTokenParse extends OperatorBaseParse<DotTokenType> {
  static Type: DotTokenType = 'TOKEN_DOT'

  static Is(token: TokenDesc<string>): token is DotTokenDesc {
    return token.type === DotTokenParse.Type
  }

  constructor() {
    super('.', DotTokenParse.Type)
  }
}
