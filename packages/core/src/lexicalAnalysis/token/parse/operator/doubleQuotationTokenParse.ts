import type { TokenDesc } from '../../type'

import OperatorBaseParse from './base'

type DoubleQuotationTokenType = 'TOKEN_DOUBLE_QUOTATION'

export interface DoubleQuotationTokenDesc
  extends TokenDesc<DoubleQuotationTokenType> {}

export class DoubleQuotationTokenParse extends OperatorBaseParse<DoubleQuotationTokenType> {
  static Type: DoubleQuotationTokenType = 'TOKEN_DOUBLE_QUOTATION'

  static Is(token: TokenDesc<string>): token is DoubleQuotationTokenDesc {
    return token.type === DoubleQuotationTokenParse.Type
  }

  constructor() {
    super('"', DoubleQuotationTokenParse.Type)
  }
}
