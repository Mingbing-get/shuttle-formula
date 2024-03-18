import type { SyntaxDesc } from '../../syntaxAnalysis'
import type { SyntaxError } from '../type'
import type { WithUndefined, WithPromise } from '../../type'
import type SyntaxCheck from '../instance'

type WithVoid<T> = T | void

export interface Checker<T extends SyntaxDesc<string>> {
  isUse: (ast: SyntaxDesc<string>) => ast is T

  check: (
    manager: SyntaxCheck,
    processId: string,
    ast: T,
    syntaxMap: Record<string, SyntaxDesc<string>>,
  ) => WithPromise<WithVoid<WithUndefined<SyntaxError.Desc>>>
}
