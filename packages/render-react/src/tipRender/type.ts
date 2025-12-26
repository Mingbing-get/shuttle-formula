import type {
  WithLabelFunction,
  FunctionGroup,
  FunctionTipOption,
  VariableTipOption,
  GetDynamicObjectByPath,
} from 'render'

export interface FunctionSelectProps {
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  option: FunctionTipOption
  onSelect?: (functionName: string) => void
}

export interface VariableSelectProps {
  getDynamicObjectByPath?: GetDynamicObjectByPath
  option: VariableTipOption
  onSelect?: (path: string[]) => void
}
