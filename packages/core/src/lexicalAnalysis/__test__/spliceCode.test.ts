import { LexicalAnalysis, useAllTokenParse } from '..'

describe('LexicalAnalysis splice code', () => {
  test('use splice code', async () => {
    const lexicalAnalysis = new LexicalAnalysis()
    useAllTokenParse(lexicalAnalysis)

    lexicalAnalysis.setCode('10 + 1')
    lexicalAnalysis.execute().then((res) => {
      const result = lexicalAnalysis.getTokenCode(res)
      expect(result).toEqual(['10', ' ', '+', ' ', '1'])
    })

    lexicalAnalysis.spliceCode(5, 1, '$a.b.c').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('10 + $a.b.c')
      expect(result).toEqual([
        '10',
        ' ',
        '+',
        ' ',
        '$',
        'a',
        '.',
        'b',
        '.',
        'c',
      ])
    })

    lexicalAnalysis.spliceCode(6, 1, 'test').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('10 + $test.b.c')
      expect(result).toEqual([
        '10',
        ' ',
        '+',
        ' ',
        '$',
        'test',
        '.',
        'b',
        '.',
        'c',
      ])
    })

    lexicalAnalysis.spliceCode(8, 0, '.').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('10 + $te.st.b.c')
      expect(result).toEqual([
        '10',
        ' ',
        '+',
        ' ',
        '$',
        'te',
        '.',
        'st',
        '.',
        'b',
        '.',
        'c',
      ])
    })

    const res = await lexicalAnalysis.spliceCode(8, 3, '')
    const result = lexicalAnalysis.getTokenCode(res.tokens)
    expect(res.code).toEqual('10 + $te.b.c')
    expect(result).toEqual(['10', ' ', '+', ' ', '$', 'te', '.', 'b', '.', 'c'])
  })

  test('use splice code when empty code', async () => {
    const lexicalAnalysis = new LexicalAnalysis()
    useAllTokenParse(lexicalAnalysis)

    lexicalAnalysis.spliceCode(0, 0, '10 + 1').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('10 + 1')
      expect(result).toEqual(['10', ' ', '+', ' ', '1'])
    })

    lexicalAnalysis.spliceCode(2, 3, '').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('101')
      expect(result).toEqual(['101'])
    })

    lexicalAnalysis.spliceCode(1, 0, '2').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('1201')
      expect(result).toEqual(['1201'])
    })

    lexicalAnalysis.spliceCode(2, 1, ' + ').then((res) => {
      const result = lexicalAnalysis.getTokenCode(res.tokens)
      expect(res.code).toEqual('12 + 1')
      expect(result).toEqual(['12', ' ', '+', ' ', '1'])
    })

    const res = await lexicalAnalysis.spliceCode(0, 6, '')
    const result = lexicalAnalysis.getTokenCode(res.tokens)
    expect(res.code).toEqual('')
    expect(result).toEqual([''])
  })

  test('use splice code start index over code length', async () => {
    const lexicalAnalysis = new LexicalAnalysis()
    useAllTokenParse(lexicalAnalysis)

    lexicalAnalysis.setCode('1 + 1')
    await lexicalAnalysis.execute()

    const res = await lexicalAnalysis.spliceCode(7, 1, '$$')
    const result = lexicalAnalysis.getTokenCode(res.tokens)
    expect(res.code).toEqual('1 + 1$$')
    expect(result).toEqual(['1', ' ', '+', ' ', '1', '$', '$'])
  })
})
