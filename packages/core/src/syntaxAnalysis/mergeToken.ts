import type { SyntaxDesc, TokenOrSyntax } from './type'
import type {
  TokenDesc,
  NumberTokenDesc,
  BooleanTokenDesc,
} from '../lexicalAnalysis'

import SyntaxAnalysis from './instance'
import { SyntaxDescUtils } from './utils'
import {
  DollerTokenParse,
  AtTokenParse,
  LeftSmallBracketTokenParse,
  RightSmallBracketTokenParse,
  QuotationTokenParse,
  DoubleQuotationTokenParse,
  DotTokenParse,
  NumberTokenParse,
  BooleanTokenParse,
  CommaTokenParse,
  LexicalAnalysis,
} from '../lexicalAnalysis'

export default class MergeToken {
  private readonly manager: SyntaxAnalysis
  private readonly processId: string

  constructor(manager: SyntaxAnalysis, processId: string) {
    this.manager = manager
    this.processId = processId
  }

  execute(inputDesc: TokenOrSyntax[]) {
    const afterMergeString = this.mergeString(inputDesc)
    return this.mergeExcludeExpressionToken(afterMergeString)
  }

  private mergeString(inputDesc: TokenOrSyntax[]) {
    const desc: TokenOrSyntax[] = []

    // 先合并字符串(防止右括号在字符串中但是却匹配到前一个左括号了)
    for (let i = 0; i < inputDesc.length; i++) {
      const currentDesc = inputDesc[i]

      if (SyntaxAnalysis.IsString(currentDesc)) {
        desc.push(currentDesc)
      } else if (QuotationTokenParse.Is(currentDesc)) {
        const valueTokens = this.findBeforeNextQuotation(inputDesc.slice(i + 1))
        const syntax = SyntaxDescUtils.CreateConst(valueTokens, 'string')

        this.addSyntax(syntax)
        desc.push(syntax.id)
        i += valueTokens.length + 1
      } else if (DoubleQuotationTokenParse.Is(currentDesc)) {
        const valueTokens = this.findBeforeNextDoubleQuotation(
          inputDesc.slice(i + 1),
        )
        const syntax = SyntaxDescUtils.CreateConst(valueTokens, 'string')
        this.addSyntax(syntax)
        desc.push(syntax.id)
        i += valueTokens.length + 1
      } else {
        desc.push(currentDesc)
      }
    }

    return desc
  }

  private mergeExcludeExpressionToken(desc: TokenOrSyntax[]) {
    const newDesc: TokenOrSyntax[] = []
    for (let i = 0; i < desc.length; i++) {
      const currentDesc = desc[i]

      if (SyntaxAnalysis.IsString(currentDesc)) {
        newDesc.push(currentDesc)
      } else if (DollerTokenParse.Is(currentDesc)) {
        const path = this.findVariablePath(desc.slice(i + 1))
        const syntax = SyntaxDescUtils.CreateVariable(currentDesc, path)
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
        i += path.length
      } else if (AtTokenParse.Is(currentDesc)) {
        const nameTokens = this.getFunctionNameToken(desc.slice(i + 1))
        const syntax = SyntaxDescUtils.CreateFunction(
          currentDesc,
          nameTokens,
          [],
        )
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
        i += nameTokens.length
      } else if (LeftSmallBracketTokenParse.Is(currentDesc)) {
        const { desc: bracketInnerDesc, offset } =
          this.findBeforeNextRightSmallBracket(desc.slice(i + 1))

        const syntax = SyntaxDescUtils.CreateExpression(
          currentDesc,
          bracketInnerDesc as Array<string>,
        )
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
        i += offset + 1
      } else if (NumberTokenParse.Is(currentDesc)) {
        const syntax = SyntaxDescUtils.CreateConst([currentDesc], 'number')
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
      } else if (BooleanTokenParse.Is(currentDesc)) {
        const syntax = SyntaxDescUtils.CreateConst([currentDesc], 'boolean')
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
      } else if (CommaTokenParse.Is(currentDesc)) {
        const syntax = SyntaxDescUtils.CreateExpression(currentDesc, [])
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
      } else if (LexicalAnalysis.IsStringToken(currentDesc)) {
        const syntax = SyntaxDescUtils.CreateUnknown(currentDesc)
        this.addSyntax(syntax)
        newDesc.push(syntax.id)
      } else {
        newDesc.push(currentDesc)
      }
    }

    return newDesc
  }

  private canAsKeyToken(
    desc: TokenDesc<string>,
  ): desc is TokenDesc<'TOKEN_STRING'> | NumberTokenDesc | BooleanTokenDesc {
    if (
      !LexicalAnalysis.IsStringToken(desc) &&
      !NumberTokenParse.Is(desc) &&
      !BooleanTokenParse.Is(desc)
    ) {
      return false
    }

    return true
  }

  private findVariablePath(desc: TokenOrSyntax[]) {
    const path: Array<TokenDesc<string>> = []

    for (const currentDesc of desc) {
      if (SyntaxAnalysis.IsString(currentDesc)) break

      if (!this.canAsKeyToken(currentDesc) && !DotTokenParse.Is(currentDesc))
        break

      path.push(currentDesc)
    }

    return path
  }

  private getFunctionNameToken(desc: TokenOrSyntax[]) {
    const functionNameTokens: Array<TokenDesc<string>> = []

    for (const currentDesc of desc) {
      if (
        SyntaxAnalysis.IsString(currentDesc) ||
        !this.canAsKeyToken(currentDesc)
      )
        break

      functionNameTokens.push(currentDesc)
    }

    return functionNameTokens
  }

  private findBeforeNextQuotation(desc: TokenOrSyntax[]) {
    const tokenDesc: Array<TokenDesc<string>> = []

    for (const currentDesc of desc) {
      if (SyntaxAnalysis.IsString(currentDesc)) {
        tokenDesc.push(...this.getTokensFromSyntax(this.getSyntax(currentDesc)))
      } else if (!QuotationTokenParse.Is(currentDesc)) {
        tokenDesc.push(currentDesc)
      } else {
        break
      }
    }

    return tokenDesc
  }

  private findBeforeNextDoubleQuotation(desc: TokenOrSyntax[]) {
    const tokenDesc: Array<TokenDesc<string>> = []

    for (const currentDesc of desc) {
      if (SyntaxAnalysis.IsString(currentDesc)) {
        tokenDesc.push(...this.getTokensFromSyntax(this.getSyntax(currentDesc)))
      } else if (!DoubleQuotationTokenParse.Is(currentDesc)) {
        tokenDesc.push(currentDesc)
      } else {
        break
      }
    }

    return tokenDesc
  }

  private getTokensFromSyntax(syntaxDesc: SyntaxDesc<string>) {
    if (SyntaxDescUtils.IsExpression(syntaxDesc)) {
      return [syntaxDesc.token]
    }

    if (SyntaxDescUtils.IsConst(syntaxDesc)) {
      return syntaxDesc.valueTokens
    }

    if (SyntaxDescUtils.IsFunction(syntaxDesc)) {
      return syntaxDesc.nameTokens
    }

    if (SyntaxDescUtils.IsVariable(syntaxDesc)) {
      return syntaxDesc.pathTokens
    }

    return []
  }

  private findBeforeNextRightSmallBracket(desc: TokenOrSyntax[]) {
    const newDesc: TokenOrSyntax[] = []
    let leftBracketCount = 1

    for (const currentDesc of desc) {
      if (!SyntaxAnalysis.IsString(currentDesc)) {
        if (LeftSmallBracketTokenParse.Is(currentDesc)) {
          leftBracketCount++
        } else if (RightSmallBracketTokenParse.Is(currentDesc)) {
          leftBracketCount--
        }
      }

      if (leftBracketCount === 0) {
        break
      }

      newDesc.push(currentDesc)
    }

    return {
      desc: this.execute(newDesc),
      offset: newDesc.length,
    }
  }

  private addSyntax(syntax: SyntaxDesc<string>) {
    this.manager.addSyntax(this.processId, syntax)
  }

  private getSyntax(syntaxId: string) {
    return this.manager.getSyntax(this.processId, syntaxId)
  }
}
