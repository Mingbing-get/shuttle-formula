import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type SubTokenType = 'TOKEN_SUB'

export interface SubTokenDesc extends TokenDesc<SubTokenType> {}

export class SubTokenParse extends OperatorBaseParse<SubTokenType> {
  static Type: SubTokenType = 'TOKEN_SUB'

  static Is(token: TokenDesc<string>): token is SubTokenDesc {
    return token.type === SubTokenParse.Type
  }

  constructor() {
    super('-', SubTokenParse.Type, false)
  }
}
