import type { StaticTokenParse, TokenParse, TokenDesc } from './token'

import { generateId } from '../utils'
import { WrapTokenParse, NumberTokenParse, BooleanTokenParse } from './token'

type StringTokenType = 'TOKEN_STRING'

interface CodeWithResolve {
  code: string
  resolve: (value: TokenDesc<string>[]) => void
}

export default class LexicalAnalysis {
  private code: string
  private syncCode: string
  private tokens: TokenDesc<string>[]

  private codeWithResolveList: CodeWithResolve[] = []

  private readonly tokenParses: Array<TokenParse<string>> = []

  constructor() {
    this.code = ''
    this.syncCode = ''
    this.tokens = [LexicalAnalysis.CreateStringToken('', 0, 0)]
  }

  useTokenParse(TokenParse: StaticTokenParse<string>) {
    this.tokenParses.push(new TokenParse())

    return this
  }

  setCode(code: string) {
    this.syncCode = code

    return this
  }

  async spliceCode(index: number, deleteCount: number, replaceCode: string) {
    const newCode =
      this.syncCode.substring(0, index) +
      replaceCode +
      this.syncCode.substring(index + deleteCount)

    const preCode = this.syncCode
    this.syncCode = newCode
    const preTokens = await this.getPreTokens(preCode)

    if (index > preCode.length) {
      index = preCode.length
      deleteCount = 0
    } else if (index < 0) {
      index = 0
    }

    const beforeTokens: TokenDesc<string>[] = []
    let afterTokens: TokenDesc<string>[] = []
    let partCode = ''
    let codeLen = 0

    for (let i = 0; i < preTokens.length; i++) {
      const token = preTokens[i]

      const afterCodeLen = codeLen + token.code.length

      if (afterCodeLen < index) {
        // 当前token在有改变的token之前，无需修改
        beforeTokens.push(token)
      }
      if (afterCodeLen >= index && (codeLen < index || !partCode)) {
        // 当前token是第一个要修改的token
        partCode = token.code.substring(0, index - codeLen) + replaceCode

        // 回溯当前token之前的token，将string、boolean、number添加到重算中
        let preToken = beforeTokens.pop()
        while (preToken) {
          partCode = `${preToken.code}${partCode}`
          if (this.needRecomputed(preToken)) {
            preToken = beforeTokens.pop()
          } else {
            break
          }
        }
      }
      if (
        afterCodeLen > index + deleteCount &&
        codeLen <= index + deleteCount
      ) {
        // 当前token是最后一个要修改的token
        partCode += token.code.substring(index + deleteCount - codeLen)
        afterTokens = preTokens.slice(i + 1)

        // 查看当前token后的token，将string、boolean、number添加到重算中
        let afterToken = afterTokens.shift()
        while (afterToken) {
          if (this.needRecomputed(afterToken)) {
            partCode = `${partCode}${afterToken.code}`
            afterToken = afterTokens.shift()
          } else {
            afterTokens.unshift(afterToken)
            break
          }
        }
      }

      codeLen = afterCodeLen
    }

    const partTokens = await this.execute(partCode)

    const newTokens = [...beforeTokens, ...partTokens, ...afterTokens]

    this.code = newCode
    this.tokens = newTokens
    this.resolveWaitingToken(newCode, newTokens)

    return {
      code: newCode,
      tokens: newTokens,
      firstUpdateIndex: beforeTokens.length,
      insertCount: partTokens.length,
      deleteCount: preTokens.length - beforeTokens.length - afterTokens.length,
    }
  }

  async execute(partCode?: string) {
    const tokens: Array<TokenDesc<string>> = []
    const executeCode = partCode ?? this.syncCode
    let code = executeCode
    let column = 0
    let row = 0
    const strList: string[] = []

    while (code) {
      const tokenDesc = this.scanTokenParse(
        code,
        column,
        row,
        tokens[tokens.length - 1],
      )

      if (!tokenDesc) {
        strList.push(code[0])
        code = code.substring(1)
        column++
      } else {
        if (strList.length > 0) {
          tokens.push(
            LexicalAnalysis.CreateStringToken(strList.join(''), column, row),
          )
          strList.length = 0
        }

        tokens.push(tokenDesc)

        code = code.substring(tokenDesc.code.length)
        if (WrapTokenParse.Is(tokenDesc)) {
          row += 1
          column = 0
        } else {
          column += tokenDesc.code.length
        }
      }
    }

    if (strList.length > 0) {
      tokens.push(
        LexicalAnalysis.CreateStringToken(strList.join(''), column, row),
      )
    }

    if (!partCode) {
      if (tokens.length === 0) {
        tokens.push(LexicalAnalysis.CreateStringToken('', 0, 0))
      }
      this.code = executeCode
      this.tokens = tokens
      this.resolveWaitingToken(executeCode, tokens)
    }

    return tokens
  }

  private async getPreTokens(preCode: string) {
    if (this.code === preCode) {
      return this.tokens
    }

    return await new Promise<TokenDesc<string>[]>((resolve) => {
      this.codeWithResolveList.push({
        code: preCode,
        resolve,
      })
    })
  }

  private resolveWaitingToken(code: string, tokens: TokenDesc<string>[]) {
    this.codeWithResolveList = this.codeWithResolveList.filter((item) => {
      if (item.code === code) {
        item.resolve(tokens)

        return false
      }

      return true
    })
  }

  getTokenCode(tokens: Array<TokenDesc<string>>) {
    return tokens.map((token) => token.code)
  }

  private scanTokenParse(
    code: string,
    column: number,
    row: number,
    preToken?: TokenDesc<string>,
  ) {
    let lastTokenDesc: TokenDesc<string> | undefined

    for (const tokenParse of this.tokenParses) {
      const { tokenDesc, prevent } = tokenParse.parse(
        code,
        column,
        row,
        preToken,
      )
      if (tokenDesc && (!lastTokenDesc || lastTokenDesc.end < tokenDesc.end)) {
        lastTokenDesc = tokenDesc
      }

      if (prevent) break
    }

    return lastTokenDesc
  }

  private needRecomputed(token: TokenDesc<string>) {
    return (
      LexicalAnalysis.IsStringToken(token) ||
      NumberTokenParse.Is(token) ||
      BooleanTokenParse.Is(token)
    )
  }

  static CreateStringToken(str: string, endIndex: number, row: number) {
    const tokenDesc: TokenDesc<StringTokenType> = {
      name: 'token',
      id: generateId(),
      type: 'TOKEN_STRING',
      row,
      start: endIndex - str.length,
      end: endIndex,
      code: str,
    }

    return tokenDesc
  }

  static IsStringToken(
    tokenDesc: TokenDesc<string>,
  ): tokenDesc is TokenDesc<StringTokenType> {
    return tokenDesc.type === 'TOKEN_STRING'
  }
}
