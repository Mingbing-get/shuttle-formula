import { LexicalAnalysis, useAllTokenParse } from '../../lexicalAnalysis'

import { SyntaxAnalysis } from '..'

import { matchAst, type InputAst } from './utils'

describe('SyntaxAnalysis', () => {
  const lexicalAnalysis = new LexicalAnalysis()
  useAllTokenParse(lexicalAnalysis)

  const syntaxAnalysis = new SyntaxAnalysis()

  async function codeToAst(code: string) {
    lexicalAnalysis.setCode(code)
    const tokens = await lexicalAnalysis.execute()

    syntaxAnalysis.setTokenDesc(tokens)
    return await syntaxAnalysis.execute()
  }

  test('empty code', async () => {
    const ast = await codeToAst(` 
      `)

    const expectAst: InputAst.Desc[] = []

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
  })

  test('empty bracket', async () => {
    const ast = await codeToAst(`()`)
    const onlyLeftBracketAst = await codeToAst('(')

    const expectAst: InputAst.Desc[] = [
      {
        type: 'expression',
        code: '(',
        children: [],
      },
    ]

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
    expect(
      matchAst(
        onlyLeftBracketAst.syntaxRootIds,
        onlyLeftBracketAst.syntaxMap,
        expectAst,
      ),
    ).toBe(true)
  })

  test('empty string', async () => {
    const ast = await codeToAst(`""`)
    const singleQuotationAst = await codeToAst(`'`)

    const expectAst: InputAst.Desc[] = [
      {
        type: 'const',
        constType: 'string',
        code: '',
      },
    ]

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
    expect(
      matchAst(
        singleQuotationAst.syntaxRootIds,
        singleQuotationAst.syntaxMap,
        expectAst,
      ),
    ).toBe(true)
  })

  test('unknown word', async () => {
    const ast = await codeToAst(`1 + test`)

    const expectAst: InputAst.Desc[] = [
      {
        type: 'expression',
        code: '+',
        children: [
          {
            type: 'const',
            constType: 'number',
            code: '1',
          },
          {
            type: 'unknown',
            code: 'test',
          },
        ],
      },
    ]

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
  })

  test('bracket in string', async () => {
    const ast = await codeToAst(`10 + (10 + "test)"`)

    const expectAst: InputAst.Desc[] = [
      {
        type: 'expression',
        code: '+',
        children: [
          { type: 'const', constType: 'number', code: '10' },
          {
            type: 'expression',
            code: '(',
            children: [
              {
                type: 'expression',
                code: '+',
                children: [
                  { type: 'const', constType: 'number', code: '10' },
                  { type: 'const', constType: 'string', code: 'test)' },
                ],
              },
            ],
          },
        ],
      },
    ]

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
  })

  test('complete expression', async () => {
    const ast = await codeToAst(`
      $a.b.c > 10 &&
      (@round(@len("test string") + $a.d * 1.2 - @random()) == (1 + $a.e / 9) * $a.f ||
      $b <= 99) &&
      10 % 9 > $d.c + @len(@toString(true))
    `)

    const expectAst: InputAst.Desc[] = [
      {
        type: 'expression',
        code: '&&',
        children: [
          {
            type: 'expression',
            code: '&&',
            children: [
              {
                type: 'expression',
                code: '>',
                children: [
                  { type: 'variable', path: 'a.b.c' },
                  { type: 'const', constType: 'number', code: '10' },
                ],
              },
              {
                type: 'expression',
                code: '(',
                children: [
                  {
                    type: 'expression',
                    code: '||',
                    children: [
                      {
                        type: 'expression',
                        code: '==',
                        children: [
                          {
                            type: 'function',
                            name: 'round',
                            params: [
                              {
                                type: 'expression',
                                code: '-',
                                children: [
                                  {
                                    type: 'expression',
                                    code: '+',
                                    children: [
                                      {
                                        type: 'function',
                                        name: 'len',
                                        params: [
                                          {
                                            type: 'const',
                                            constType: 'string',
                                            code: 'test string',
                                          },
                                        ],
                                      },
                                      {
                                        type: 'expression',
                                        code: '*',
                                        children: [
                                          { type: 'variable', path: 'a.d' },
                                          {
                                            type: 'const',
                                            constType: 'number',
                                            code: '1.2',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    type: 'function',
                                    name: 'random',
                                    params: [],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'expression',
                            code: '*',
                            children: [
                              {
                                type: 'expression',
                                code: '(',
                                children: [
                                  {
                                    type: 'expression',
                                    code: '+',
                                    children: [
                                      {
                                        type: 'const',
                                        constType: 'number',
                                        code: '1',
                                      },
                                      {
                                        type: 'expression',
                                        code: '/',
                                        children: [
                                          { type: 'variable', path: 'a.e' },
                                          {
                                            type: 'const',
                                            constType: 'number',
                                            code: '9',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                              { type: 'variable', path: 'a.f' },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'expression',
                        code: '<=',
                        children: [
                          { type: 'variable', path: 'b' },
                          { type: 'const', constType: 'number', code: '99' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'expression',
            code: '>',
            children: [
              {
                type: 'expression',
                code: '%',
                children: [
                  { type: 'const', constType: 'number', code: '10' },
                  { type: 'const', constType: 'number', code: '9' },
                ],
              },
              {
                type: 'expression',
                code: '+',
                children: [
                  { type: 'variable', path: 'd.c' },
                  {
                    type: 'function',
                    name: 'len',
                    params: [
                      {
                        type: 'function',
                        name: 'toString',
                        params: [
                          { type: 'const', constType: 'boolean', code: 'true' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    expect(matchAst(ast.syntaxRootIds, ast.syntaxMap, expectAst)).toBe(true)
  })
})
