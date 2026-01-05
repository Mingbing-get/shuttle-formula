import { WithDynamicVariable } from '@shuttle-formula/render'

import { VariablePlugin } from '../type'

export default class BooleanPlugin implements VariablePlugin.Instance<VariablePlugin.BooleanDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.BooleanDefine {
    return define.type === 'boolean'
  }

  toFormula(define: VariablePlugin.BooleanDefine) {
    return {
      type: define.type,
      label: define.label,
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'boolean'
  }
}
