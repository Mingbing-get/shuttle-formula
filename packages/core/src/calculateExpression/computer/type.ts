import type { SyntaxDesc } from '../../syntaxAnalysis'
import type { WithPromise, VariableDefine } from '../../type'
import type CalculateExpression from '../instance'

type WithVoid<T> = T | void

export interface Computer<T extends SyntaxDesc<string>> {
  isUse: (ast: SyntaxDesc<string>) => ast is T

  computed: (
    manager: CalculateExpression,
    processId: string,
    ast: T,
    syntaxMap: Record<string, SyntaxDesc<string>>,
    variableMap?: Map<string, VariableDefine.Desc>,
  ) => WithPromise<WithVoid<any>>
}
