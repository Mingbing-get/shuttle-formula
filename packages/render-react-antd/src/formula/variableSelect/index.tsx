import type { VariableTipOption } from 'render'
import FormulaVariablePickerPanel, {
  VariablePickerPanelProps,
} from './formulaVariablePickerPanel'

export interface VariableSelectProps
  extends Omit<VariablePickerPanelProps, 'variablePath' | 'variables'> {
  option: VariableTipOption
}

export default function VariableSelect({
  option,
  ...extra
}: VariableSelectProps) {
  return (
    <FormulaVariablePickerPanel
      variablePath={option.path}
      variables={option.startVariable}
      {...extra}
    />
  )
}
