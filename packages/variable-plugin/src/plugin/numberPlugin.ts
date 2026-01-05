import { WithDynamicVariable } from '@shuttle-formula/render'

import { VariablePlugin } from '../type'

export default class NumberPlugin implements VariablePlugin.Instance<VariablePlugin.NumberDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.NumberDefine {
    return define.type === 'number'
  }

  toFormula(define: VariablePlugin.NumberDefine) {
    return {
      type: define.type,
      label: define.label,
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'number'
  }
}
