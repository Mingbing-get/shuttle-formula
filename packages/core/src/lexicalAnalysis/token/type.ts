export interface TokenDesc<T extends string> {
  name: 'token'
  id: string
  type: T
  row: number
  start: number
  end: number
  code: string
}

export interface StaticTokenParse<T extends string> {
  new (): TokenParse<T>
  Type: T
  Is: (token: TokenDesc<any>) => token is TokenDesc<T>
}

export interface TokenParse<T extends string> {
  parse: (
    code: string,
    startIndex: number,
    row: number,
  ) => { tokenDesc?: TokenDesc<T>; prevent: boolean }
}
