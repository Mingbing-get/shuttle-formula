import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type DollerTokenType = 'TOKEN_DOLLER'

export interface DollerTokenDesc extends TokenDesc<DollerTokenType> {}

export class DollerTokenParse extends OperatorBaseParse<DollerTokenType> {
  static Type: DollerTokenType = 'TOKEN_DOLLER'

  static Is(token: TokenDesc<string>): token is DollerTokenDesc {
    return token.type === DollerTokenParse.Type
  }

  constructor() {
    super('$', DollerTokenParse.Type)
  }
}
