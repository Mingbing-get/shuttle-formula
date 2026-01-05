import { WithDynamicVariable } from '@shuttle-formula/render'

import { VariablePlugin } from '../type'

export default class DateTimePlugin implements VariablePlugin.Instance<VariablePlugin.DateTimeDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.DateTimeDefine {
    return define.type === 'datetime'
  }

  toFormula(define: VariablePlugin.DateTimeDefine) {
    return {
      type: 'custom-datetime' as `custom-${string}`,
      label: define.label,
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'custom-datetime'
  }
}
