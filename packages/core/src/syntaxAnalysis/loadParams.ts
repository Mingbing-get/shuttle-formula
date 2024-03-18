import type { SyntaxDesc, TokenOrSyntax } from './type'

import SyntaxAnalysis from './instance'
import { SyntaxDescUtils } from './utils'
import { LeftSmallBracketTokenParse } from '../lexicalAnalysis'

export default class LoadParams {
  private readonly manager: SyntaxAnalysis
  private readonly processId: string

  constructor(manager: SyntaxAnalysis, processId: string) {
    this.manager = manager
    this.processId = processId
  }

  execute(desc: TokenOrSyntax[]) {
    const newDesc: TokenOrSyntax[] = []

    for (let i = 0; i < desc.length; i++) {
      const item = desc[i]
      const currentDesc = SyntaxAnalysis.IsString(item)
        ? this.getSyntax(item)
        : item
      newDesc.push(item)
      // 遇到 ( 递归children
      if (
        SyntaxAnalysis.Is(currentDesc) &&
        SyntaxDescUtils.IsExpression(currentDesc) &&
        LeftSmallBracketTokenParse.Is(currentDesc.token)
      ) {
        currentDesc.children = this.execute(
          currentDesc.children,
        ) as Array<string>
        continue
      }

      if (
        !SyntaxAnalysis.Is(currentDesc) ||
        !SyntaxDescUtils.IsFunction(currentDesc) ||
        i + 1 === desc.length
      ) {
        continue
      }

      const nextItem = desc[i + 1]
      const nextDesc = SyntaxAnalysis.IsString(nextItem)
        ? this.getSyntax(nextItem)
        : nextItem
      if (
        !SyntaxAnalysis.Is(nextDesc) ||
        !SyntaxDescUtils.IsExpression(nextDesc) ||
        !LeftSmallBracketTokenParse.Is(nextDesc.token)
      ) {
        continue
      }

      // 递归函数的params
      currentDesc.params = this.execute(nextDesc.children) as Array<string>
      i++
    }

    return newDesc
  }

  private addSyntax(syntax: SyntaxDesc<string>) {
    this.manager.addSyntax(this.processId, syntax)
  }

  private getSyntax(syntaxId: string) {
    return this.manager.getSyntax(this.processId, syntaxId)
  }
}
