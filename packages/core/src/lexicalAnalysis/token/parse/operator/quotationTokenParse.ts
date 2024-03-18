import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type QuotationTokenType = 'TOKEN_QUOTATION'

export interface QuotationTokenDesc extends TokenDesc<QuotationTokenType> {}

export class QuotationTokenParse extends OperatorBaseParse<QuotationTokenType> {
  static Type: QuotationTokenType = 'TOKEN_QUOTATION'

  static Is(token: TokenDesc<string>): token is QuotationTokenDesc {
    return token.type === QuotationTokenParse.Type
  }

  constructor() {
    super("'", QuotationTokenParse.Type)
  }
}
