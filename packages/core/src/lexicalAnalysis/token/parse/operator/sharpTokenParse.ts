import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type SharpTokenType = 'TOKEN_SHARP'

export interface SharpTokenDesc extends TokenDesc<SharpTokenType> {}

export class SharpTokenParse extends OperatorBaseParse<SharpTokenType> {
  static Type: SharpTokenType = 'TOKEN_SHARP'

  static Is(token: TokenDesc<string>): token is SharpTokenDesc {
    return token.type === SharpTokenParse.Type
  }

  constructor() {
    super('#', SharpTokenParse.Type)
  }
}
