import type { FunctionDefine } from 'core'

export interface TransformCustomReturn {
  scope: 'customReturn'
  createType: string
}

export interface TransformFunctionDesc
  extends Omit<FunctionDefine.Desc, 'return'> {
  return:
    | FunctionDefine.ConfirmReturn
    | FunctionDefine.ForwardParamsReturn
    | FunctionDefine.ForwardParamsArray
    | TransformCustomReturn
}

export function functionDefineToTransform(
  functionReturn: FunctionDefine.Return,
  typeName: string,
): TransformFunctionDesc['return'] {
  if (!isCustomReturn(functionReturn)) {
    return functionReturn
  }

  return {
    scope: 'customReturn',
    createType: typeName,
  }
}

export function functionTransformToDefine(
  functionReturn: TransformFunctionDesc['return'],
  createType: Function,
): FunctionDefine.Return {
  if (!isTransformCustomReturn(functionReturn)) {
    return functionReturn
  }

  return {
    scope: 'customReturn',
    createType,
  } as any
}

export function isCustomReturn(
  re: FunctionDefine.Return,
): re is FunctionDefine.CustomReturn {
  return (re as any).scope === 'customReturn'
}

export function isTransformCustomReturn(
  re: TransformFunctionDesc['return'],
): re is TransformCustomReturn {
  return (re as any).scope === 'customReturn'
}
