import type {
  WithLabelFunction,
  FunctionGroup,
  FunctionTipOption,
  WithDynamicVariable,
  VariableTipOption,
  GetDynamicObjectByPath,
} from 'render'

export interface FunctionSelectProps {
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  option: FunctionTipOption
  onSelect?: (functionName: string) => void
}

export interface VariableSelectProps {
  variables?: Record<string, WithDynamicVariable>
  getDynamicObjectByPath?: GetDynamicObjectByPath
  option: VariableTipOption
  onSelect?: (path: string[]) => void
}
