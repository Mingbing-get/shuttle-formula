import type {
  WithLabelFunction,
  FunctionGroup,
} from '@shuttle-formula/functions'
import type {
  FunctionTipOption,
  VariableTipOption,
  GetDynamicObjectByPath,
} from '@shuttle-formula/render'

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
