import {
  LexicalAnalysis,
  useAllTokenParse,
  SyntaxAnalysis,
  CalculateExpression,
  useAllComputer,
} from 'core'
import { WithDynamicVariable, GetDynamicObjectByPath } from 'render'

import getVariableValueByPath from './getVariableValueByPath'
import { functionValues } from '../formula/functionDefine'

interface Options {
  context?: Record<string, any>
  contextDefine?: Record<string, WithDynamicVariable>
  code?: string
  getDynamicObjectByPath?: GetDynamicObjectByPath
}

export default async function computedFormula({
  context,
  contextDefine,
  code,
  getDynamicObjectByPath,
}: Options) {
  if (!code) return

  const lexicalAnalysis = new LexicalAnalysis()
  useAllTokenParse(lexicalAnalysis)

  const syntaxAnalysis = new SyntaxAnalysis()

  const calculateExpression = new CalculateExpression()
  useAllComputer(calculateExpression)

  calculateExpression.setGetVariableFu(async (path) => {
    return await getVariableValueByPath(
      path,
      contextDefine || {},
      getDynamicObjectByPath,
      context,
    )
  })
  calculateExpression.setGetFunctionFu(
    (functionName) => functionValues[functionName],
  )

  // 计算
  lexicalAnalysis.setCode(code)
  const tokens = await lexicalAnalysis.execute()

  syntaxAnalysis.setTokenDesc(tokens)
  const ast = await syntaxAnalysis.execute()

  const result = await calculateExpression.execute(
    ast.syntaxRootIds,
    ast.syntaxMap,
  )

  return result
}
