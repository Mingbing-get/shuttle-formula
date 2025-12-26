import type { SyntaxDesc, TokenOrSyntax } from './type'
import type { StaticTokenParse } from '../lexicalAnalysis'

import SyntaxAnalysis from './instance'
import { SyntaxDescUtils } from './utils'
import {
  LeftSmallBracketTokenParse,
  DotTokenParse,
  // binary expression
  MulTokenParse,
  DivTokenParse,
  ModTokenParse,
  AddTokenParse,
  SubTokenParse,
  EqTokenParse,
  GtTokenParse,
  GteTokenParse,
  NeqTokenParse,
  LtTokenParse,
  LteTokenParse,
  AndTokenParse,
  OrTokenParse,
} from '../lexicalAnalysis'

export default class ComputedBinaryExpression {
  private readonly manager: SyntaxAnalysis
  private readonly processId: string

  private readonly tokenParseAndLevel: Array<{
    level: number
    parseList: Array<StaticTokenParse<string>>
  }> = [
    {
      level: 120,
      parseList: [DotTokenParse],
    },
    {
      level: 100,
      parseList: [MulTokenParse, DivTokenParse, ModTokenParse],
    },
    {
      level: 80,
      parseList: [AddTokenParse, SubTokenParse],
    },
    {
      level: 40,
      parseList: [
        EqTokenParse,
        GtTokenParse,
        GteTokenParse,
        NeqTokenParse,
        LtTokenParse,
        LteTokenParse,
      ],
    },
    {
      level: 20,
      parseList: [AndTokenParse, OrTokenParse],
    },
  ]

  constructor(manager: SyntaxAnalysis, processId: string) {
    this.manager = manager
    this.processId = processId
  }

  execute(inputDesc: TokenOrSyntax[]) {
    const desc = [...inputDesc]

    for (let i = 0; i < desc.length; i++) {
      const item = desc[i]
      const currentDesc = SyntaxAnalysis.IsString(item)
        ? this.getSyntax(item)
        : item
      if (SyntaxAnalysis.Is(currentDesc)) {
        if (
          SyntaxDescUtils.IsExpression(currentDesc) &&
          LeftSmallBracketTokenParse.Is(currentDesc.token)
        ) {
          currentDesc.children = this.execute(currentDesc.children)
        } else if (SyntaxDescUtils.IsFunction(currentDesc)) {
          currentDesc.params = this.execute(currentDesc.params)
        }
      }
    }

    this.tokenParseAndLevel.sort((pre, cur) => cur.level - pre.level)
    for (const tokenParse of this.tokenParseAndLevel) {
      for (let i = 0; i < desc.length; i++) {
        const currentDesc = desc[i]
        if (SyntaxAnalysis.IsString(currentDesc)) continue

        const isInThisGroup = tokenParse.parseList.some((parse) =>
          parse.Is(currentDesc),
        )
        if (!isInThisGroup) continue

        let preDesc = i > 0 ? desc[i - 1] : undefined
        let nextDesc = i + 1 < desc.length ? desc[i + 1] : undefined
        const children: Array<string> = []

        if (preDesc) {
          if (!SyntaxAnalysis.IsString(preDesc)) {
            preDesc = undefined
          } else {
            children.push(preDesc)
          }
        }
        if (nextDesc) {
          if (!SyntaxAnalysis.IsString(nextDesc)) {
            nextDesc = undefined
          } else {
            children.push(nextDesc)
          }
        }

        const newDesc = SyntaxDescUtils.CreateExpression(currentDesc, children)
        this.addSyntax(newDesc)
        const startIndex = preDesc ? i - 1 : i
        let deleteCount = 1
        if (preDesc) {
          deleteCount++
          i--
        }
        if (nextDesc) {
          deleteCount++
        }
        desc.splice(startIndex, deleteCount, newDesc.id)
      }
    }

    return desc as Array<string>
  }

  private addSyntax(syntax: SyntaxDesc<string>) {
    this.manager.addSyntax(this.processId, syntax)
  }

  private getSyntax(syntaxId: string) {
    return this.manager.getSyntax(this.processId, syntaxId)
  }
}
