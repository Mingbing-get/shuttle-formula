import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type DivTokenType = 'TOKEN_DIV'

export interface DivTokenDesc extends TokenDesc<DivTokenType> {}

export class DivTokenParse extends OperatorBaseParse<DivTokenType> {
  static Type: DivTokenType = 'TOKEN_DIV'

  static Is(token: TokenDesc<string>): token is DivTokenDesc {
    return token.type === DivTokenParse.Type
  }

  constructor() {
    super('/', DivTokenParse.Type)
  }
}
