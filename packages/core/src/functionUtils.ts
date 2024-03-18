import { type FunctionDefine } from './type'

const FunctionUtils = {
  IsForwardInputParams(
    params: FunctionDefine.Params,
  ): params is FunctionDefine.ForwardInputParams {
    return (params as any).forwardInput
  },

  IsForwardParamsReturn(
    r: FunctionDefine.Return,
  ): r is FunctionDefine.ForwardParamsReturn {
    return (r as any).scope === 'forwardParams'
  },

  IsForwardParamsArray(
    r: FunctionDefine.Return,
  ): r is FunctionDefine.ForwardParamsArray {
    return (r as any).scope === 'forwardParamsArray'
  },

  IsCustomReturn(r: FunctionDefine.Return): r is FunctionDefine.CustomReturn {
    return (r as any).scope === 'customReturn'
  },
}

export default FunctionUtils
