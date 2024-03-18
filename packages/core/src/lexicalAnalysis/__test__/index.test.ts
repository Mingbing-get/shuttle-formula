import { LexicalAnalysis, useAllTokenParse } from '..'

describe('LexicalAnalysis', () => {
  const lexicalAnalysis = new LexicalAnalysis()
  useAllTokenParse(lexicalAnalysis)

  test('operator and space', async () => {
    const code = `+ - * / % > < >= <= == != && || 
    , ( ) [ ] $ # @ . " '`
    lexicalAnalysis.setCode(code)
    const tokens = await lexicalAnalysis.execute()
    const result = lexicalAnalysis.getTokenCode(tokens)

    expect(result).toEqual([
      '+',
      ' ',
      '-',
      ' ',
      '*',
      ' ',
      '/',
      ' ',
      '%',
      ' ',
      '>',
      ' ',
      '<',
      ' ',
      '>=',
      ' ',
      '<=',
      ' ',
      '==',
      ' ',
      '!=',
      ' ',
      '&&',
      ' ',
      '||',
      ' ',
      '\n',
      '    ',
      ',',
      ' ',
      '(',
      ' ',
      ')',
      ' ',
      '[',
      ' ',
      ']',
      ' ',
      '$',
      ' ',
      '#',
      ' ',
      '@',
      ' ',
      '.',
      ' ',
      '"',
      ' ',
      "'",
    ])
  })

  test('empty', async () => {
    lexicalAnalysis.setCode('')
    const tokens = await lexicalAnalysis.execute()
    const result = lexicalAnalysis.getTokenCode(tokens)

    expect(result).toEqual([''])
  })

  test('one row express', async () => {
    lexicalAnalysis.setCode('$a.b.c + @sum(10, $a.d) >= 10.8')
    const tokens = await lexicalAnalysis.execute()
    const result = lexicalAnalysis.getTokenCode(tokens)

    expect(result).toEqual([
      '$',
      'a',
      '.',
      'b',
      '.',
      'c',
      ' ',
      '+',
      ' ',
      '@',
      'sum',
      '(',
      '10',
      ',',
      ' ',
      '$',
      'a',
      '.',
      'd',
      ')',
      ' ',
      '>=',
      ' ',
      '10.8',
    ])
  })

  test('multiple row express', async () => {
    const code = `$a.b.c + @sum(10, $a.d) * @random() / 10 >= 10.8
    && true 
    && ($test1 == 10 || @sum(9.9, @round($test)) % 8 != 9)`

    lexicalAnalysis.setCode(code)
    const tokens = await lexicalAnalysis.execute()
    const result = lexicalAnalysis.getTokenCode(tokens)

    expect(result).toEqual([
      '$',
      'a',
      '.',
      'b',
      '.',
      'c',
      ' ',
      '+',
      ' ',
      '@',
      'sum',
      '(',
      '10',
      ',',
      ' ',
      '$',
      'a',
      '.',
      'd',
      ')',
      ' ',
      '*',
      ' ',
      '@',
      'random',
      '(',
      ')',
      ' ',
      '/',
      ' ',
      '10',
      ' ',
      '>=',
      ' ',
      '10.8',
      '\n',
      '    ',
      '&&',
      ' ',
      'true',
      ' ',
      '\n',
      '    ',
      '&&',
      ' ',
      '(',
      '$',
      'test',
      '1',
      ' ',
      '==',
      ' ',
      '10',
      ' ',
      '||',
      ' ',
      '@',
      'sum',
      '(',
      '9.9',
      ',',
      ' ',
      '@',
      'round',
      '(',
      '$',
      'test',
      ')',
      ')',
      ' ',
      '%',
      ' ',
      '8',
      ' ',
      '!=',
      ' ',
      '9',
      ')',
    ])
  })
})
