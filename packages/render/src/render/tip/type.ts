import type { FunctionSyntaxDesc, VariableSyntaxDesc } from 'core'

export interface VariableTipOption {
  type: 'variable'
  syntax: VariableSyntaxDesc
  path: string[]
}

export interface FunctionTipOption {
  type: 'function'
  syntax: FunctionSyntaxDesc
  name: string
}

export interface VariablePicker {
  updateTipOption: (option: VariableTipOption) => void
  setOnSelect: (onSelect: (path: string[]) => void) => void
  getRoot: () => Node
}

export interface FunctionPicker {
  updateTipOption: (option: FunctionTipOption) => void
  setOnSelect: (onSelect: (functionName: string) => void) => void
  getRoot: () => Node
}
