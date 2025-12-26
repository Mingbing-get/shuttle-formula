import { type TokenDesc } from '../../lexicalAnalysis'
import { type SyntaxDesc } from '../type'
import { SyntaxAnalysis } from '..'
import { SyntaxDescUtils } from '../utils'

export namespace InputAst {
  export interface Base<T extends string> {
    type: T
  }

  export interface ExpressionInputAst extends Base<'expression'> {
    code: string
    children: Desc[]
  }

  export interface VariableInputAst extends Base<'variable'> {
    path: string
  }

  export interface DotInputAst extends Base<'dot'> {
    start: Desc
    path: string
  }

  export interface FunctionInputAst extends Base<'function'> {
    name: string
    params: Desc[]
  }

  export interface ConstInputAst extends Base<'const'> {
    constType: 'string' | 'number' | 'boolean'
    code: string
  }

  export interface UnknownInputAst extends Base<'unknown'> {
    code: string
  }

  export type Desc =
    | ExpressionInputAst
    | VariableInputAst
    | DotInputAst
    | FunctionInputAst
    | ConstInputAst
    | UnknownInputAst
}

export function matchAst(
  syntaxRootIds: Array<string>,
  syntaxMap: Record<string, SyntaxDesc<string>>,
  inputAst: InputAst.Desc[],
): string | true {
  if (syntaxRootIds.length !== inputAst.length) {
    return `长度不同：实际长度：${syntaxRootIds.length}, 期望长度：${inputAst.length}`
  }

  for (let i = 0; i < syntaxRootIds.length; i++) {
    const currentId = syntaxRootIds[i]
    const currentInputAst = inputAst[i]

    if (!SyntaxAnalysis.IsString(currentId)) {
      return `不是一个语法树: ${JSON.stringify(currentId)}`
    }

    const currentAst = syntaxMap[currentId]
    const errorMsg = JSON.stringify({
      factAst: currentAst,
      expectAst: currentInputAst,
    })

    if (SyntaxDescUtils.IsConst(currentAst)) {
      if (currentAst.type !== currentInputAst.type) return errorMsg

      if (currentAst.constType !== currentInputAst.constType) return errorMsg

      if (getCodeFromTokens(currentAst.valueTokens) !== currentInputAst.code) {
        return errorMsg
      }
    }

    if (SyntaxDescUtils.IsVariable(currentAst)) {
      if (currentAst.type !== currentInputAst.type) return errorMsg

      if (getCodeFromTokens(currentAst.pathTokens) !== currentInputAst.path) {
        return errorMsg
      }
    }

    if (SyntaxDescUtils.IsExpression(currentAst)) {
      if (currentAst.type !== currentInputAst.type) return errorMsg

      if (currentAst.token.code !== currentInputAst.code) return errorMsg

      const childrenIsMatch = matchAst(
        currentAst.children,
        syntaxMap,
        currentInputAst.children,
      )
      if (childrenIsMatch !== true) {
        return childrenIsMatch
      }
    }

    if (SyntaxDescUtils.IsFunction(currentAst)) {
      if (currentAst.type !== currentInputAst.type) return errorMsg

      if (getCodeFromTokens(currentAst.nameTokens) !== currentInputAst.name) {
        return errorMsg
      }

      const paramsIsMatch = matchAst(
        currentAst.params,
        syntaxMap,
        currentInputAst.params,
      )
      if (paramsIsMatch !== true) {
        return paramsIsMatch
      }
    }

    if (SyntaxDescUtils.IsUnknown(currentAst)) {
      if (currentAst.type !== currentInputAst.type) return errorMsg

      if (currentAst.token.code !== currentInputAst.code) return errorMsg
    }
  }

  return true
}

export function astToInputAst(
  syntaxRootIds: Array<string>,
  syntaxMap: Record<string, SyntaxDesc<string>>,
): InputAst.Desc[] {
  const inputAst: InputAst.Desc[] = []

  for (let i = 0; i < syntaxRootIds.length; i++) {
    const currentId = syntaxRootIds[i]

    if (!SyntaxAnalysis.IsString(currentId)) {
      throw new Error(`不是一个语法树: ${JSON.stringify(currentId)}`)
    }

    const currentAst = syntaxMap[currentId]

    if (SyntaxDescUtils.IsConst(currentAst)) {
      inputAst.push({
        type: currentAst.type,
        constType: currentAst.constType,
        code: getCodeFromTokens(currentAst.valueTokens),
      })
    }

    if (SyntaxDescUtils.IsVariable(currentAst)) {
      inputAst.push({
        type: currentAst.type,
        path: getCodeFromTokens(currentAst.pathTokens),
      })
    }

    if (SyntaxDescUtils.IsDot(currentAst)) {
      const start = astToInputAst([currentAst.startSyntaxId], syntaxMap)[0]
      inputAst.push({
        type: currentAst.type,
        start,
        path: getCodeFromTokens(currentAst.pathTokens),
      })
    }

    if (SyntaxDescUtils.IsExpression(currentAst)) {
      const children = astToInputAst(currentAst.children, syntaxMap)
      inputAst.push({
        type: currentAst.type,
        code: currentAst.token.code,
        children,
      })
    }

    if (SyntaxDescUtils.IsFunction(currentAst)) {
      const params = astToInputAst(currentAst.params, syntaxMap)
      inputAst.push({
        type: currentAst.type,
        name: getCodeFromTokens(currentAst.nameTokens),
        params,
      })
    }

    if (SyntaxDescUtils.IsUnknown(currentAst)) {
      inputAst.push({
        type: currentAst.type,
        code: currentAst.token.code,
      })
    }
  }

  return inputAst
}

function getCodeFromTokens(tokens: Array<TokenDesc<string>>) {
  return tokens.reduce((total, token) => `${total}${token.code}`, '')
}
