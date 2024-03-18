import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type MulTokenType = 'TOKEN_MUL'

export interface MulTokenDesc extends TokenDesc<MulTokenType> {}

export class MulTokenParse extends OperatorBaseParse<MulTokenType> {
  static Type: MulTokenType = 'TOKEN_MUL'

  static Is(token: TokenDesc<string>): token is MulTokenDesc {
    return token.type === MulTokenParse.Type
  }

  constructor() {
    super('*', MulTokenParse.Type)
  }
}
