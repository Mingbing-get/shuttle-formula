import { useState } from 'react'
import FormulaVariablePickerPanel, { VariablePickerPanelProps } from '../../variableSelect/formulaVariablePickerPanel'

interface Props extends Omit<VariablePickerPanelProps, 'variablePath' | 'openOnSelectPath' | 'openPath' | 'onOpen'> {}

export default function FormulaVariable(props: Props) {
  const [openPath, setOpenPath] = useState<string[]>()

  return (
    <div className="formula-variable-wrapper">
      <FormulaVariablePickerPanel {...props} openPath={openPath} openOnSelectPath={false} onOpen={setOpenPath} />
    </div>
  )
}
