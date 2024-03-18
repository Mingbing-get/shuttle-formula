import type { TokenParse, TokenDesc } from '../type'

import { generateId } from '../../../utils'

type TableTokenType = 'TOKEN_TABLE'

export interface TableTokenDesc extends TokenDesc<TableTokenType> {}

export class TableTokenParse implements TokenParse<TableTokenType> {
  static Type: TableTokenType = 'TOKEN_TABLE'
  private readonly tableReg = /^\t+/

  static Is(token: TokenDesc<string>): token is TableTokenDesc {
    return token.type === TableTokenParse.Type
  }

  parse(code: string, startIndex: number, row: number) {
    const matchRes = code.match(this.tableReg)

    if (!matchRes) return { prevent: false }

    const tableCode = matchRes[0]

    const token: TableTokenDesc = {
      name: 'token',
      id: generateId(),
      type: TableTokenParse.Type,
      row,
      start: startIndex,
      end: startIndex + tableCode.length,
      code: tableCode,
    }

    return {
      tokenDesc: token,
      prevent: true,
    }
  }
}
