import { VariableDefine } from '@shuttle-formula/core'
import { WithDynamicVariable } from '@shuttle-formula/render'

export function variableCanAcceptFormula(
  variableDesc: VariableDefine.Desc,
  formulaType: WithDynamicVariable,
): boolean {
  if (variableDesc.type === 'boolean') {
    return formulaType.type === 'boolean'
  }

  if (variableDesc.type === 'string') {
    return formulaType.type === 'string'
  }

  if (variableDesc.type === 'number') {
    return formulaType.type === 'number'
  }

  if (variableDesc.type.startsWith('custom-')) {
    return formulaType.type === variableDesc.type
  }

  if (variableDesc.type === 'object') {
    if (formulaType.type !== 'object') return false

    for (const key in variableDesc.prototype) {
      if (!formulaType.prototype[key]) return false

      if (
        !variableCanAcceptFormula(
          variableDesc.prototype[key],
          formulaType.prototype[key],
        )
      )
        return false
    }

    return true
  }

  if (variableDesc.type === 'array') {
    if (formulaType.type !== 'array') return false

    return variableCanAcceptFormula(
      variableDesc.item as VariableDefine.Desc,
      formulaType.item,
    )
  }

  throw new Error(`未知类型：${(variableDesc as any).type}`)
}
