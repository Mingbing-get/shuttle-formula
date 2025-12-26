import type { ExpressionSyntaxDesc, SyntaxDesc } from './type'

import SyntaxAnalysis from './instance'
import { SyntaxDescUtils } from './utils'
import { DotTokenParse, TokenDesc } from '../lexicalAnalysis'

export default class ParseDotSyntax {
  private readonly manager: SyntaxAnalysis
  private readonly processId: string

  constructor(manager: SyntaxAnalysis, processId: string) {
    this.manager = manager
    this.processId = processId
  }

  execute(syntaxIds: string[]) {
    const newSyntaxIds: string[] = []

    for (let i = 0; i < syntaxIds.length; i++) {
      const id = syntaxIds[i]
      const currentDesc = this.getSyntax(id)

      if (SyntaxDescUtils.IsFunction(currentDesc)) {
        currentDesc.params = this.execute(currentDesc.params)
      }

      if (
        SyntaxDescUtils.IsExpression(currentDesc) &&
        DotTokenParse.Is(currentDesc.token)
      ) {
        newSyntaxIds.push(this.dotExpression(currentDesc))
      } else {
        if (SyntaxDescUtils.IsExpression(currentDesc)) {
          currentDesc.children = this.execute(currentDesc.children)
        }

        newSyntaxIds.push(id)
      }
    }

    return newSyntaxIds
  }

  private dotExpression(currentDesc: ExpressionSyntaxDesc): string {
    let handleDesc = currentDesc
    const pathTokens: TokenDesc<string>[] = []

    while (true) {
      for (let i = 1; i < handleDesc.children.length; i++) {
        const childId = handleDesc.children[i]
        const childDesc = this.getSyntax(childId)
        if (SyntaxDescUtils.IsConst(childDesc)) {
          pathTokens.unshift(...childDesc.valueTokens)
          this.removeSyntax(childDesc.id)
        }
      }

      this.removeSyntax(handleDesc.id)
      const firstChildId = handleDesc.children[0] || ''
      const firstChildDesc = this.getSyntax(firstChildId)
      if (
        firstChildDesc &&
        SyntaxDescUtils.IsExpression(firstChildDesc) &&
        DotTokenParse.Is(firstChildDesc.token)
      ) {
        pathTokens.unshift(handleDesc.token)
        handleDesc = firstChildDesc
      } else {
        break
      }
    }

    if (currentDesc.children.length === 0) {
      const syntax = SyntaxDescUtils.CreateDot(
        '',
        currentDesc.token,
        pathTokens,
      )
      this.addSyntax(syntax)
      return syntax.id
    }

    this.execute([handleDesc.children[0]])
    const syntax = SyntaxDescUtils.CreateDot(
      handleDesc.children[0],
      handleDesc.token,
      pathTokens,
    )
    this.addSyntax(syntax)
    return syntax.id
  }

  private addSyntax(syntax: SyntaxDesc<string>) {
    this.manager.addSyntax(this.processId, syntax)
  }

  private removeSyntax(syntaxId: string) {
    this.manager.removeSyntax(this.processId, syntaxId)
  }

  private getSyntax(syntaxId: string) {
    return this.manager.getSyntax(this.processId, syntaxId)
  }
}
