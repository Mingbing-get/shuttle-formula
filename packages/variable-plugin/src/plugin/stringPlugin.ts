import { WithDynamicVariable } from '@shuttle-formula/render'

import { VariablePlugin } from '../type'

export default class StringPlugin implements VariablePlugin.Instance<VariablePlugin.StringDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.StringDefine {
    return define.type === 'string'
  }

  toFormula(define: VariablePlugin.StringDefine) {
    return {
      type: define.type,
      label: define.label,
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'string'
  }
}
