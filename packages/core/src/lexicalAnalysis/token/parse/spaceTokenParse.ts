import type { TokenParse, TokenDesc } from '../type'

import { generateId } from '../../../utils'

type SpaceTokenType = 'TOKEN_SPACE'

export interface SpaceTokenDesc extends TokenDesc<SpaceTokenType> {}

export class SpaceTokenParse implements TokenParse<SpaceTokenType> {
  static Type: SpaceTokenType = 'TOKEN_SPACE'
  private readonly spaceReg = /^ +/

  static Is(token: TokenDesc<string>): token is SpaceTokenDesc {
    return token.type === SpaceTokenParse.Type
  }

  parse(code: string, startIndex: number, row: number) {
    const matchRes = code.match(this.spaceReg)

    if (!matchRes) return { prevent: false }

    const spaceCode = matchRes[0]

    const token: SpaceTokenDesc = {
      name: 'token',
      id: generateId(),
      type: SpaceTokenParse.Type,
      row,
      start: startIndex,
      end: startIndex + spaceCode.length,
      code: spaceCode,
    }

    return {
      tokenDesc: token,
      prevent: true,
    }
  }
}
