import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type ModTokenType = 'TOKEN_MOD'

export interface ModTokenDesc extends TokenDesc<ModTokenType> {}

export class ModTokenParse extends OperatorBaseParse<ModTokenType> {
  static Type: ModTokenType = 'TOKEN_MOD'

  static Is(token: TokenDesc<string>): token is ModTokenDesc {
    return token.type === ModTokenParse.Type
  }

  constructor() {
    super('%', ModTokenParse.Type)
  }
}
