import { DotTokenParse } from 'core'
import type { VariableSyntaxDesc, FunctionSyntaxDesc, TokenDesc } from 'core'

import type { WithDynamicVariable, RenderOption } from '../type'

export function findOriginVariable(
  variableAst: VariableSyntaxDesc,
  token: TokenDesc<string>,
  variableDefine?: Record<string, WithDynamicVariable>,
) {
  const variablePath: string[] = []
  let tempPath = ''
  for (const pathItem of variableAst.pathTokens) {
    if (DotTokenParse.Is(pathItem)) {
      variablePath.push(tempPath)
      tempPath = ''
    } else {
      tempPath += pathItem.code
    }

    if (pathItem.id === token.id) {
      if (tempPath.length > 0) {
        variablePath.push(tempPath)
      }
      break
    }
  }

  return getVariableByPath(variablePath, variableDefine ?? {})
}

function getVariableByPath(
  path: string[],
  variable: Record<string, WithDynamicVariable>,
): WithDynamicVariable | undefined {
  if (path.length === 0) return

  const item = variable[path[0]]

  if (path.length === 1 || !item) return item

  if (item.type !== 'object') return

  return getVariableByPath(
    path.splice(1),
    item.prototype as Record<string, WithDynamicVariable>,
  )
}

export function findOriginFunction(
  functionAst: FunctionSyntaxDesc,
  token: TokenDesc<string>,
  functionDefine?: RenderOption['functions'],
) {
  if (!functionDefine) return

  const functionName = functionAst.nameTokens
    .map((nameToken) => nameToken.code)
    .join('')
  if (functionDefine instanceof Array) {
    for (const item of functionDefine) {
      const res = item.functions[functionName]
      if (res) {
        return res
      }
    }
  } else {
    return functionDefine[functionName]
  }
}
