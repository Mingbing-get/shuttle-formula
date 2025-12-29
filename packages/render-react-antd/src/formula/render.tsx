import { VariableDefine } from 'core'
import { Provider, VariableTip, FunctionTip } from 'render-react'
import {
  FunctionGroup,
  GetDynamicObjectByPath,
  WithDynamicVariable,
  WithLabelFunction,
} from 'render'

import FunctionSelect from './functionSelect'
import VariableSelect from './variableSelect'
import OnChange, { OnChangeProps } from './onChange'
import RenderEditor from './renderEditor'

interface Props extends OnChangeProps {
  className?: string
  style?: React.CSSProperties
  code?: string
  getDynamicObjectByPath?: GetDynamicObjectByPath
  needAccept?: VariableDefine.Desc | VariableDefine.Desc[]
  variables?: Record<string, WithDynamicVariable>
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  disabled?: boolean
}

export default function RenderFormula({
  className,
  style,
  code,
  needAccept,
  variables,
  functions,
  disabled,
  onAstChange,
  onTokenChange,
  getDynamicObjectByPath,
}: Props) {
  return (
    <Provider
      disabled={disabled}
      code={code}
      variables={variables}
      functions={functions}
      getDynamicObjectByPath={getDynamicObjectByPath}
    >
      <RenderEditor
        style={style}
        className={className}
        needAccept={needAccept}
        disabled={disabled}
      />
      <VariableTip VariableSelect={VariableSelect} />
      <FunctionTip FunctionSelect={FunctionSelect} />
      <OnChange onAstChange={onAstChange} onTokenChange={onTokenChange} />
    </Provider>
  )
}
