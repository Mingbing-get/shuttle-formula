import { VariableDefine } from '@shuttle-formula/core'
import {
  Provider,
  VariableTip,
  FunctionTip,
} from '@shuttle-formula/render-react'

import type {
  FunctionGroup,
  WithLabelFunction,
  FunctionDescription,
} from '@shuttle-formula/functions'
import type {
  GetDynamicObjectByPath,
  WithDynamicVariable,
} from '@shuttle-formula/render'

import FunctionSelect from './functionSelect'
import VariableSelect from './variableSelect'
import OnChange, { OnChangeProps } from './onChange'
import RenderEditor from './renderEditor'

export interface FormulaRenderProps extends OnChangeProps {
  className?: string
  style?: React.CSSProperties
  code?: string
  getDynamicObjectByPath?: GetDynamicObjectByPath
  accept?:
    | VariableDefine.Desc
    | VariableDefine.Desc[]
    | ((returnType: WithDynamicVariable) => string | undefined)
  variables?: Record<string, WithDynamicVariable>
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
  disabled?: boolean
}

export default function RenderFormula({
  className,
  style,
  code,
  accept,
  variables,
  functions,
  disabled,
  onAstChange,
  onTokenChange,
  getDynamicObjectByPath,
}: FormulaRenderProps) {
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
        accept={accept}
        disabled={disabled}
      />
      <VariableTip VariableSelect={VariableSelect} />
      <FunctionTip FunctionSelect={FunctionSelect} />
      <OnChange onAstChange={onAstChange} onTokenChange={onTokenChange} />
    </Provider>
  )
}
