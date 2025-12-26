import { LexicalAnalysis, useAllTokenParse } from '../../lexicalAnalysis'

import { SyntaxAnalysis } from '../../syntaxAnalysis'
import { SyntaxCheck, useAllChecker } from '../../syntaxCheck'
import CalculateExpression from '../instance'
import { useAllComputer } from '../computer'

import {
  getVarByPath,
  getFunctionByName,
} from '../../syntaxCheck/__test__/mock'
import { getVar, getFunction } from './mock'

describe('CalculateExpression', () => {
  const lexicalAnalysis = new LexicalAnalysis()
  useAllTokenParse(lexicalAnalysis)

  const syntaxAnalysis = new SyntaxAnalysis()
  const syntaxCheck = new SyntaxCheck()
  useAllChecker(syntaxCheck)

  const calculateExpression = new CalculateExpression()
  useAllComputer(calculateExpression)

  syntaxCheck.setGetVariableFu(getVarByPath)
  syntaxCheck.setGetFunctionFu(getFunctionByName)

  calculateExpression.setGetVariableFu(getVar)
  calculateExpression.setGetFunctionFu(getFunction)

  async function executeCode(code: string) {
    lexicalAnalysis.setCode(code)
    const tokens = await lexicalAnalysis.execute()

    syntaxAnalysis.setTokenDesc(tokens)
    const ast = await syntaxAnalysis.execute()
    const checkRes = await syntaxCheck.check(ast.syntaxRootIds, ast.syntaxMap)

    if (checkRes instanceof Map) {
      return await calculateExpression.execute(ast.syntaxRootIds, ast.syntaxMap)
    }

    throw new Error(JSON.stringify(checkRes))
  }

  test('function forwardParamsArray', async () => {
    const res = await executeCode(`@len(@createArray(1, 1, -2.1, 3))`)

    expect(res).toBe(4)
  })

  test('function customReturn', async () => {
    const res = await executeCode(`@createObject("key1", 1, "key2", $a.b)`)

    expect(res).toEqual({
      key1: 1,
      key2: {
        c: 11,
      },
    })
  })

  test('complete expression', async () => {
    const res = await executeCode(`
      $a.b.c > 10 &&
      (@round(@len("test string") + $a.d * 1.2 - @random()) == (1 + $a.e / 9) * $a.f ||
      $b <= 99) &&
      10 % 9 > $d.c + @len(@anyToString(true))
    `)

    expect(res).toBe(false)
  })

  test('suport dot token when like object variable', async () => {
    const res = await executeCode(
      `@createObject("key1", 1, "key2", $a.b).key1 + $a.d`,
    )

    expect(res).toBe(2)
  })
})
