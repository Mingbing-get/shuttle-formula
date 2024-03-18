import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type AddTokenType = 'TOKEN_ADD'

export interface AddTokenDesc extends TokenDesc<AddTokenType> {}

export class AddTokenParse extends OperatorBaseParse<AddTokenType> {
  static Type: AddTokenType = 'TOKEN_ADD'

  static Is(token: TokenDesc<string>): token is AddTokenDesc {
    return token.type === AddTokenParse.Type
  }

  constructor() {
    super('+', AddTokenParse.Type)
  }
}
