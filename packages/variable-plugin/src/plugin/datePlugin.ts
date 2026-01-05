import { WithDynamicVariable } from '@shuttle-formula/render'

import { VariablePlugin } from '../type'

export default class DatePlugin implements VariablePlugin.Instance<VariablePlugin.DateDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.DateDefine {
    return define.type === 'date'
  }

  toFormula(define: VariablePlugin.DateDefine) {
    return {
      type: 'custom-date' as `custom-${string}`,
      label: define.label,
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'custom-date'
  }
}
