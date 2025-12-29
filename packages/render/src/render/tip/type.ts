import type {
  FunctionSyntaxDesc,
  VariableSyntaxDesc,
  DotSyntaxDesc,
} from '@shuttle-formula/core'
import { WithDynamicVariable } from '../../type'

export interface VariableTipOption {
  type: 'variable'
  syntax: VariableSyntaxDesc | DotSyntaxDesc
  startVariable?: Record<string, WithDynamicVariable>
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
