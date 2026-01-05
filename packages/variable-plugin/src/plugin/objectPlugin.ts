import { WithDynamicVariable } from '@shuttle-formula/render'

import variablePluginManager from './variablePluginManager'

import { VariablePlugin } from '../type'

export default class ObjectPlugin implements VariablePlugin.Instance<VariablePlugin.ObjectDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.ObjectDefine {
    return define.type === 'object'
  }

  toFormula(define: VariablePlugin.ObjectDefine) {
    const prototype: Record<string, WithDynamicVariable> = {}

    for (const [key, value] of Object.entries(define.properties)) {
      prototype[key] = variablePluginManager.toFormula(value)
    }

    return {
      type: define.type,
      label: define.label,
      prototype,
    }
  }

  accept(
    returnType: WithDynamicVariable,
    define: VariablePlugin.ObjectDefine,
  ): boolean {
    if (returnType.type !== 'object') return false

    const formula = this.toFormula(define)

    return Object.keys(formula.prototype).every((key) => {
      return returnType.prototype?.[key]?.type === formula.prototype[key]?.type
    })
  }
}
