import { Component } from 'vue'

import {
  FunctionGroup,
  FunctionTipOption,
  GetDynamicObjectByPath,
  VariableTipOption,
  WithDynamicVariable,
  WithLabelFunction,
} from 'render'

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
