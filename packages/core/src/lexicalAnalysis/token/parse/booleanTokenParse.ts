import type { TokenParse, TokenDesc } from '../type'

import { generateId } from '../../../utils'
import { DollerTokenParse, AtTokenParse, DotTokenParse } from './operator'

type BooleanTokenType = 'TOKEN_BOOLEAN'

export interface BooleanTokenDesc extends TokenDesc<BooleanTokenType> {
  value: boolean
}

export class BooleanTokenParse implements TokenParse<BooleanTokenType> {
  static Type: BooleanTokenType = 'TOKEN_BOOLEAN'

  static Is(token: TokenDesc<string>): token is BooleanTokenDesc {
    return token.type === BooleanTokenParse.Type
  }

  parse(
    code: string,
    startIndex: number,
    row: number,
    preToken?: TokenDesc<string>,
  ) {
    if (this.isDefineToken(preToken)) {
      return { prevent: false }
    }

    let booleanCode: 'true' | 'false' | undefined
    if (code.startsWith('true')) {
      booleanCode = 'true'
    } else if (code.startsWith('false')) {
      booleanCode = 'false'
    }

    if (!booleanCode) {
      return { prevent: false }
    }

    const token: BooleanTokenDesc = {
      name: 'token',
      id: generateId(),
      type: BooleanTokenParse.Type,
      row,
      start: startIndex,
      end: startIndex + booleanCode.length,
      code: booleanCode,
      value: booleanCode === 'true',
    }

    return {
      tokenDesc: token,
      prevent: true,
    }
  }

  private isDefineToken(token?: TokenDesc<string>) {
    return (
      token &&
      (DollerTokenParse.Is(token) ||
        DotTokenParse.Is(token) ||
        AtTokenParse.Is(token))
    )
  }
}
