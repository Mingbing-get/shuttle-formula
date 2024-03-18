import type { TokenDesc, TokenParse } from '../../type'

import { generateId } from '../../../../utils'

export default class OperatorBaseParse<T extends string>
  implements TokenParse<T>
{
  private readonly op: string
  private readonly type: T
  private readonly preventWhenMatch

  constructor(op: string, type: T, preventWhenMatch: boolean = true) {
    this.op = op
    this.type = type
    this.preventWhenMatch = preventWhenMatch
  }

  parse(code: string, startIndex: number, row: number) {
    if (code.startsWith(this.op)) {
      const token: TokenDesc<T> = {
        name: 'token',
        id: generateId(),
        type: this.type,
        row,
        start: startIndex,
        end: startIndex + this.op.length,
        code: this.op,
      }

      return { tokenDesc: token, prevent: this.preventWhenMatch }
    }

    return { prevent: false }
  }
}
