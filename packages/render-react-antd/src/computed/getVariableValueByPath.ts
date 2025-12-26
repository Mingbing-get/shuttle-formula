import {
  WithDynamicVariable,
  GetDynamicObjectByPath,
  WithDynamicVariableObject,
} from 'render'

export default async function getVariableValueByPath(
  path: string[],
  variableDefine: Record<string, WithDynamicVariable>,
  getDynamicObjectByPath?: GetDynamicObjectByPath,
  context?: Record<string, any>,
) {
  if (path.length === 0 || !context) return

  let value = context[path[0]]
  if (path.length === 1) {
    return value
  }

  let currentDefine = variableDefine[path[0]]
  if (!currentDefine) return

  let leftPath = path.slice(1)
  if (currentDefine.type === 'array') {
    const nextKey = Number(path[1])
    if (isNaN(nextKey) || !(value instanceof Array)) return

    value = value[nextKey]
    if (path.length === 2) {
      return value
    }

    leftPath = path.slice(2)
  }

  if (currentDefine.type === 'array') {
    currentDefine = currentDefine.item
  }

  if (isWithDynamicObject(currentDefine)) {
    const dynamicVariable = await getDynamicObjectByPath?.(
      leftPath,
      currentDefine,
    )
    if (!dynamicVariable) return

    currentDefine = dynamicVariable
  }

  if (currentDefine.type === 'object') {
    return await getVariableValueByPath(
      leftPath,
      currentDefine.prototype,
      getDynamicObjectByPath,
      value,
    )
  }
}

function isWithDynamicObject(
  variable: WithDynamicVariable,
): variable is WithDynamicVariableObject {
  return (
    variable.type === 'object' &&
    !(variable as any).prototype &&
    (variable as any).dynamic
  )
}
