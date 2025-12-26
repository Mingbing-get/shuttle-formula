import { type TokenDesc } from '../lexicalAnalysis'

export interface SyntaxDesc<T extends string> {
  name: 'syntax'
  id: string
  type: T
}

export interface ExpressionSyntaxDesc extends SyntaxDesc<'expression'> {
  token: TokenDesc<string>
  children: Array<string>
}

export interface VariableSyntaxDesc extends SyntaxDesc<'variable'> {
  triggerToken: TokenDesc<string>
  pathTokens: Array<TokenDesc<string>>
}

export interface DotSyntaxDesc extends SyntaxDesc<'dot'> {
  startSyntaxId: string
  triggerToken: TokenDesc<string>
  pathTokens: Array<TokenDesc<string>>
}

export interface FunctionSyntaxDesc extends SyntaxDesc<'function'> {
  triggerToken: TokenDesc<string>
  nameTokens: Array<TokenDesc<string>>
  params: Array<string>
}

export interface ConstSyntaxDesc extends SyntaxDesc<'const'> {
  constType: 'string' | 'number' | 'boolean'
  valueTokens: Array<TokenDesc<string>>
}

export interface UnknownSyntaxDesc extends SyntaxDesc<'unknown'> {
  token: TokenDesc<string>
}

export type TokenOrSyntax = TokenDesc<string> | string
