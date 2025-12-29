import type { Component } from 'vue'

import type {
  FunctionTipOption,
  GetDynamicObjectByPath,
  VariableTipOption,
  WithDynamicVariable,
} from '@shuttle-formula/render'
import type {
  FunctionGroup,
  WithLabelFunction,
} from '@shuttle-formula/functions'

export interface FunctionSelectProps {
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  option: FunctionTipOption
  onSelect?: (functionName: string) => void
}

export type FunctionSelectComponent = Component<FunctionSelectProps>

export interface VariableSelectProps {
  variables?: Record<string, WithDynamicVariable>
  getDynamicObjectByPath?: GetDynamicObjectByPath
  option: VariableTipOption
  onSelect?: (path: string[]) => void
}

export type VariableSelectComponent = Component<VariableSelectProps>
