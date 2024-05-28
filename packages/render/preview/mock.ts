import type { VariableDefine, SyntaxError } from 'core'

import { SyntaxDescUtils } from 'core'

import {
  type WithDynamicVariable,
  type WithLabelFunction,
  type FunctionGroup,
  type GetDynamicObjectByPath,
} from '../src/type'

export const vars: Record<string, WithDynamicVariable> = {
  global: {
    type: 'object',
    label: '全局',
    prototype: {
      button: {
        type: 'object',
        label: '按钮',
        prototype: {
          count: {
            label: '数字',
            type: 'number',
          },
        },
      },
      d: {
        type: 'number',
      },
      e: {
        type: 'number',
      },
      f: {
        type: 'number',
      },
    },
  },
  b: {
    type: 'number',
  },
  test1truefalse123: {
    type: 'number',
    label: '测试变量',
  },
  d: {
    type: 'object',
    prototype: {
      c: {
        type: 'number',
      },
      e: {
        type: 'object',
        dynamic: true,
      },
    },
  },
}

export const getDynamicObjectByPath: GetDynamicObjectByPath = async (
  path,
  define,
) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        type: 'object',
        prototype: {
          test: {
            label: '测试异步',
            type: 'number',
          },
        },
      })
    }, 500)
  })
}

function createError(
  type: SyntaxError.Desc['type'],
  syntaxId: string,
  msg: string,
): SyntaxError.Desc {
  return { type, syntaxId, msg }
}

export const functions: Record<string, WithLabelFunction> = {
  createObject: {
    label: '创建对象',
    params: [{ define: { type: 'string' } }, { forwardInput: true }],
    loopAfterParams: 2,
    return: {
      scope: 'customReturn',
      createType: async (getType, ...params) => {
        const defReturn: VariableDefine.Object = {
          type: 'object',
          prototype: {},
        }

        for (let i = 0; i < params.length; i += 2) {
          const currentParams = params[i]

          if (i + 1 >= params.length) {
            return {
              pass: false,
              error: createError(
                'functionError',
                currentParams.id,
                '键未匹配值',
              ),
            }
          }

          if (
            !SyntaxDescUtils.IsConst(currentParams) ||
            currentParams.constType !== 'string'
          ) {
            return {
              pass: false,
              error: createError(
                'functionError',
                currentParams.id,
                '键名字能是常量字符串',
              ),
            }
          }

          const valueParams = params[i + 1]
          const valueParamsType = await getType(valueParams.id)

          if (!valueParamsType) {
            return {
              pass: false,
              error: createError(
                'functionError',
                valueParams.id,
                '未找到参数类型',
              ),
            }
          }

          const key = currentParams.valueTokens
            .map((token) => token.code)
            .join('')

          defReturn.prototype[key] = { ...valueParamsType }
        }

        return {
          pass: true,
          type: defReturn,
        }
      },
    },
  },
  createArray: {
    label: '创建数组',
    params: [{ forwardInput: true }],
    loopAfterParams: 1,
    loopParamsMustSameWithFirstWhenForwardInput: true,
    return: {
      scope: 'forwardParamsArray',
      item: { scope: 'forwardParams', paramsIndex: 0 },
    },
  },
  len: {
    label: '计算长度',
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: { type: 'number' },
  },
  round: {
    label: '四舍五入',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
  },
  random: {
    label: '随机数',
    params: [],
    return: { type: 'number' },
  },
  anyToString: {
    label: '转字符串',
    params: [{ forwardInput: true }],
    return: { type: 'string' },
  },
}

export const functionWithGroups: FunctionGroup[] = [
  {
    id: 'create',
    label: '创建相关',
    functions: {
      createObject: {
        label: '创建对象',
        params: [{ define: { type: 'string' } }, { forwardInput: true }],
        loopAfterParams: 2,
        return: {
          scope: 'customReturn',
          createType: async (getType, ...params) => {
            const defReturn: VariableDefine.Object = {
              type: 'object',
              prototype: {},
            }

            for (let i = 0; i < params.length; i += 2) {
              const currentParams = params[i]

              if (i + 1 >= params.length) {
                return {
                  pass: false,
                  error: createError(
                    'functionError',
                    currentParams.id,
                    '键未匹配值',
                  ),
                }
              }

              if (
                !SyntaxDescUtils.IsConst(currentParams) ||
                currentParams.constType !== 'string'
              ) {
                return {
                  pass: false,
                  error: createError(
                    'functionError',
                    currentParams.id,
                    '键名字能是常量字符串',
                  ),
                }
              }

              const valueParams = params[i + 1]
              const valueParamsType = await getType(valueParams.id)

              if (!valueParamsType) {
                return {
                  pass: false,
                  error: createError(
                    'functionError',
                    valueParams.id,
                    '未找到参数类型',
                  ),
                }
              }

              const key = currentParams.valueTokens
                .map((token) => token.code)
                .join('')

              defReturn.prototype[key] = { ...valueParamsType }
            }

            return {
              pass: true,
              type: defReturn,
            }
          },
        },
      },
      createArray: {
        label: '创建数组',
        params: [{ forwardInput: true }],
        loopAfterParams: 1,
        loopParamsMustSameWithFirstWhenForwardInput: true,
        return: {
          scope: 'forwardParamsArray',
          item: { scope: 'forwardParams', paramsIndex: 0 },
        },
      },
      random: {
        label: '随机数',
        params: [],
        return: { type: 'number' },
      },
    },
  },
  {
    id: 'transform',
    label: '转换',
    functions: {
      anyToString: {
        label: '转字符串',
        params: [{ forwardInput: true }],
        return: { type: 'string' },
      },
    },
  },
  {
    id: 'computed',
    label: '计算',
    functions: {
      len: {
        label: '计算长度',
        params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
        return: { type: 'number' },
      },
      round: {
        label: '四舍五入',
        params: [{ define: { type: 'number' } }],
        return: { type: 'number' },
      },
    },
  },
]
