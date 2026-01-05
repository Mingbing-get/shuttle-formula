import { useMemo } from 'react'
import { WithDynamicVariable } from '@shuttle-formula/render'
import {
  variablePluginManager,
  VariablePlugin,
} from '@shuttle-formula/variable-plugin'

import useEffectCallback from '../hooks/useEffectCallback'
import FormulaRender, { FormulaRenderProps } from './render'

export interface FormulaRenderUsePluginProps extends Omit<
  FormulaRenderProps,
  'getDynamicObjectByPath' | 'accept' | 'variables'
> {
  accept?: {
    defines: VariablePlugin.Define[]
    exclude?: boolean
  }
  variables?: Record<string, VariablePlugin.Define>
}

export default function RenderUsePlugin({
  accept,
  variables,
  ...extra
}: FormulaRenderUsePluginProps) {
  const formulaVariables = useMemo(
    () => variablePluginManager.recordToFormula(variables || {}),
    [variables],
  )

  const getDynamicObjectByPath = useMemo(
    () => variablePluginManager.createGetDynamicObjectByPath(),
    [],
  )

  const handleAccept = useEffectCallback(
    (returnType: WithDynamicVariable) => {
      if (!accept?.defines.length) return

      const acceptFn = variablePluginManager.createAccept(
        accept.defines,
        accept.exclude,
      )
      return acceptFn(returnType)
    },
    [accept],
  )

  return (
    <FormulaRender
      {...extra}
      variables={formulaVariables}
      getDynamicObjectByPath={getDynamicObjectByPath}
      accept={handleAccept}
    />
  )
}
