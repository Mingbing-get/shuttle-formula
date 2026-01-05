import { WithDynamicVariable } from '@shuttle-formula/render'

import variablePluginManager from './variablePluginManager'

import { VariablePlugin } from '../type'

export default class ArrayPlugin implements VariablePlugin.Instance<VariablePlugin.ArrayDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.ArrayDefine {
    return define.type === 'array'
  }

  toFormula(define: VariablePlugin.ArrayDefine) {
    return {
      type: define.type,
      label: define.label,
      item: variablePluginManager.toFormula(define.item),
    }
  }

  accept(
    returnType: WithDynamicVariable,
    define: VariablePlugin.ArrayDefine,
  ): boolean {
    if (returnType.type !== 'array') return false

    const formula = this.toFormula(define)
    return returnType.item.type === formula.item.type
  }
}
