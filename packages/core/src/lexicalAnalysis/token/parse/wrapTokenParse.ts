import type { TokenParse, TokenDesc } from '../type'

import { generateId } from '../../../utils'

type WrapTokenType = 'TOKEN_WRAP'

export interface WrapTokenDesc extends TokenDesc<WrapTokenType> {}

export class WrapTokenParse implements TokenParse<WrapTokenType> {
  static Type: WrapTokenType = 'TOKEN_WRAP'
  private readonly wrapReg = /^\n{1}/

  static Is(token: TokenDesc<string>): token is WrapTokenDesc {
    return token.type === WrapTokenParse.Type
  }

  parse(code: string, startIndex: number, row: number) {
    const matchRes = code.match(this.wrapReg)

    if (!matchRes) return { prevent: false }

    const wrapCode = matchRes[0]

    const token: WrapTokenDesc = {
      name: 'token',
      id: generateId(),
      type: WrapTokenParse.Type,
      row,
      start: startIndex,
      end: startIndex + wrapCode.length,
      code: wrapCode,
    }

    return {
      tokenDesc: token,
      prevent: true,
    }
  }
}
