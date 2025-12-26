import type { TokenDesc } from '../lexicalAnalysis/token'
import type { SyntaxDesc, TokenOrSyntax } from './type'

import {
  SpaceTokenParse,
  WrapTokenParse,
  TableTokenParse,
  QuotationTokenParse,
  DoubleQuotationTokenParse,
} from '../lexicalAnalysis'
import { generateId } from '../utils'

import MergeToken from './mergeToken'
import LoadParams from './loadParams'
import ParseDotSyntax from './parseDotSyntax'
import ComputedBinaryExpression from './computedBinaryExpression'

export default class SyntaxAnalysis {
  private tokenDesc: Array<TokenDesc<string>>
  private readonly syntaxMapWithProcess: Map<
    string,
    Record<string, SyntaxDesc<string>>
  >

  constructor() {
    this.tokenDesc = []
    this.syntaxMapWithProcess = new Map()
  }

  setTokenDesc(tokenDesc: Array<TokenDesc<string>>) {
    this.tokenDesc = tokenDesc

    return this
  }

  async execute() {
    const processId = generateId()
    this.syntaxMapWithProcess.set(processId, {})

    const notSpaceTokenDesc = this.eatSpaceToken(this.tokenDesc)

    const mergeToken = new MergeToken(this, processId)
    const afterMergeDesc = mergeToken.execute(notSpaceTokenDesc)

    const loadParams = new LoadParams(this, processId)
    const afterLoadParams = loadParams.execute(afterMergeDesc)

    const computedExpression = new ComputedBinaryExpression(this, processId)
    const afterComputedExpression = computedExpression.execute(afterLoadParams)

    // 将.语法的树结构解析成path
    const parseDotSyntax = new ParseDotSyntax(this, processId)
    const afterParseDotSyntax = parseDotSyntax.execute(afterComputedExpression)

    const syntaxMap = this.syntaxMapWithProcess.get(processId) ?? {}
    this.syntaxMapWithProcess.delete(processId)

    return {
      syntaxRootIds: afterParseDotSyntax,
      syntaxMap,
    }
  }

  getSyntax(processId: string, syntaxId: string) {
    const syntaxMap = this.syntaxMapWithProcess.get(processId)

    if (!syntaxMap) {
      throw new Error(`没有进行中的解析流程，流程id:${processId}`)
    }

    return syntaxMap[syntaxId]
  }

  addSyntax(processId: string, syntax: SyntaxDesc<string>) {
    const syntaxMap = this.syntaxMapWithProcess.get(processId)

    if (!syntaxMap) {
      throw new Error(`没有进行中的解析流程，流程id:${processId}`)
    }

    syntaxMap[syntax.id] = syntax
  }

  removeSyntax(processId: string, syntaxId: string) {
    const syntaxMap = this.syntaxMapWithProcess.get(processId)

    if (!syntaxMap) {
      throw new Error(`没有进行中的解析流程，流程id:${processId}`)
    }

    delete syntaxMap[syntaxId]
  }

  private eatSpaceToken(tokens: Array<TokenDesc<string>>) {
    let quotation = ''
    return tokens.filter((token) => {
      if (!quotation) {
        if (
          QuotationTokenParse.Is(token) ||
          DoubleQuotationTokenParse.Is(token)
        ) {
          quotation = token.type
          return true
        }

        return (
          !SpaceTokenParse.Is(token) &&
          !WrapTokenParse.Is(token) &&
          !TableTokenParse.Is(token)
        )
      } else if (token.type === quotation) {
        quotation = ''
      }

      return true
    })
  }

  static Is(
    desc: TokenDesc<string> | SyntaxDesc<string>,
  ): desc is SyntaxDesc<string> {
    return desc.name === 'syntax'
  }

  static IsString(desc: TokenOrSyntax): desc is string {
    return typeof desc === 'string'
  }
}
