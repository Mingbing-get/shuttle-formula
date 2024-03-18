import type { SyntaxDesc } from '../../syntaxAnalysis'
import type { WithPromise } from '../../type'
import type CalculateExpression from '../instance'

type WithVoid<T> = T | void

export interface Computer<T extends SyntaxDesc<string>> {
  isUse: (ast: SyntaxDesc<string>) => ast is T

  computed: (
    manager: CalculateExpression,
    processId: string,
    ast: T,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) => WithPromise<WithVoid<any>>
}
