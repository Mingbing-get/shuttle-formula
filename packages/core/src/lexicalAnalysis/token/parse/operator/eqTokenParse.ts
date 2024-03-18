import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type EqTokenType = 'TOKEN_EQ'

export interface EqTokenDesc extends TokenDesc<EqTokenType> {}

export class EqTokenParse extends OperatorBaseParse<EqTokenType> {
  static Type: EqTokenType = 'TOKEN_EQ'

  static Is(token: TokenDesc<string>): token is EqTokenDesc {
    return token.type === EqTokenParse.Type
  }

  constructor() {
    super('==', EqTokenParse.Type)
  }
}
