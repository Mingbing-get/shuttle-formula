import type { TokenParse, TokenDesc } from '../type'

import { generateId } from '../../../utils'

type NumberTokenType = 'TOKEN_NUMBER'

export interface NumberTokenDesc extends TokenDesc<NumberTokenType> {
  value: number
}

export class NumberTokenParse implements TokenParse<NumberTokenType> {
  static Type: NumberTokenType = 'TOKEN_NUMBER'
  private readonly numberReg = /^-?\d+(\.\d+)?/

  static Is(token: TokenDesc<string>): token is NumberTokenDesc {
    return token.type === NumberTokenParse.Type
  }

  parse(code: string, startIndex: number, row: number) {
    const matchRes = code.match(this.numberReg)

    if (!matchRes) return { prevent: false }

    const numberCode = matchRes[0]

    const token: NumberTokenDesc = {
      name: 'token',
      id: generateId(),
      type: NumberTokenParse.Type,
      row,
      start: startIndex,
      end: startIndex + numberCode.length,
      code: numberCode,
      value: Number(numberCode),
    }

    return {
      tokenDesc: token,
      prevent: true,
    }
  }
}
