export namespace SyntaxError {
  export interface Base<T extends string> {
    syntaxId: string
    type: T
    msg: string
  }

  export interface ProgramError extends Base<'programError'> {}

  export interface UndefinedError extends Base<'undefinedError'> {}

  export interface UnknownTokenError extends Base<'unknownTokenError'> {}

  export interface VariablePathError extends Base<'variablePathError'> {}

  export interface OperatorError extends Base<'operatorError'> {}

  export interface FunctionError extends Base<'functionError'> {}

  export type Desc =
    | ProgramError
    | UndefinedError
    | VariablePathError
    | OperatorError
    | FunctionError
    | UnknownTokenError
}
