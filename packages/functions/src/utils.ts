import {
  VariableDefine,
  SyntaxError,
  WithUndefined,
} from '@shuttle-formula/core'

export function createError(
  type: SyntaxError.Desc['type'],
  syntaxId: string,
  msg: string,
): SyntaxError.Desc {
  return { type, syntaxId, msg }
}

export function deepCompareType(
  type1: VariableDefine.Desc,
  type2: VariableDefine.Desc,
) {
  if (type1.type !== type2.type) return false

  if (type1.type === 'array' && type2.type === 'array') {
    return deepCompareType(type1.item, type2.item)
  }

  if (type1.type === 'object' && type2.type === 'object') {
    for (const key in type1.prototype) {
      if (!type1.prototype[key] || !type2.prototype[key]) return false

      if (!deepCompareType(type1.prototype[key], type2.prototype[key]))
        return false
    }
  }

  return true
}

export function isItemsArray(
  typeDesc: WithUndefined<VariableDefine.Desc>,
  itemTypes: VariableDefine.Desc['type'][],
): typeDesc is VariableDefine.Array {
  if (typeDesc?.type !== 'array') {
    return false
  }

  if (!itemTypes.includes(typeDesc.item.type)) {
    return false
  }

  return true
}
