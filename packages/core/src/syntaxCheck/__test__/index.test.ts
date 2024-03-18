import { LexicalAnalysis, useAllTokenParse } from '../../lexicalAnalysis'

import { SyntaxAnalysis } from '../../syntaxAnalysis'
import SyntaxCheck from '../instance'
import { useAllChecker } from '../checker'

import { getVarByPath, getFunctionByName } from './mock'

describe('SyntaxCheck', () => {
  const lexicalAnalysis = new LexicalAnalysis()
  useAllTokenParse(lexicalAnalysis)

  const syntaxAnalysis = new SyntaxAnalysis()
  const syntaxCheck = new SyntaxCheck()
  useAllChecker(syntaxCheck)

  syntaxCheck.setGetVariableFu(getVarByPath)
  syntaxCheck.setGetFunctionFu(getFunctionByName)

  async function checkCode(code: string) {
    lexicalAnalysis.setCode(code)
    const tokens = await lexicalAnalysis.execute()

    syntaxAnalysis.setTokenDesc(tokens)
    const ast = await syntaxAnalysis.execute()

    return await syntaxCheck.check(ast.syntaxRootIds, ast.syntaxMap)
  }

  test('function forwardParamsArray', async () => {
    const checkRes = await checkCode(`@len(@createArray(1, 1, -2.1, 3))`)

    expect(checkRes instanceof Map).toBe(true)
  })

  test('function customReturn', async () => {
    const checkRes = await checkCode(`@createObject("key1", 1, "key2", $a.b)`)

    expect(checkRes instanceof Map).toBe(true)
  })

  test('variable path endswith dot', async () => {
    const checkRes = await checkCode(`$a.b.`)

    expect(checkRes instanceof Map).toBe(false)
  })

  test('variable path has continue dot', async () => {
    const checkRes = await checkCode(`$a..b`)

    expect(checkRes instanceof Map).toBe(false)
  })

  test('unknown token', async () => {
    const checkRes = await checkCode(`$a.b.c + test`)

    expect(checkRes instanceof Map).toBe(false)
  })

  test('function not bracket when not params', async () => {
    const checkRes = await checkCode(`@random`)

    expect(checkRes instanceof Map).toBe(true)
  })

  test('complete expression', async () => {
    const checkRes = await checkCode(`
      $a.b.c > 10 &&
      (@round(@len("test string") + $a.d * 1.2 - @random()) == (1 + $a.e / 9) * $a.f ||
      $b <= 99) &&
      10 % 9 > $d.c + @len(@anyToString(true))
    `)

    expect(checkRes instanceof Map).toBe(true)
  })
})
