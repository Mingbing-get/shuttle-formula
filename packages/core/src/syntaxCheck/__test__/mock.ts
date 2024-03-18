import { type VariableDefine, type FunctionDefine } from '../../type'
import { type SyntaxError } from '../type'

import { SyntaxDescUtils } from '../../syntaxAnalysis'

export const vars: VariableDefine.Desc = {
  type: 'object',
  prototype: {
    a: {
      type: 'object',
      prototype: {
        b: {
          type: 'object',
          prototype: {
            c: {
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
    d: {
      type: 'object',
      prototype: {
        c: {
          type: 'number',
        },
      },
    },
  },
}

function createError(
  type: SyntaxError.Desc['type'],
  syntaxId: string,
  msg: string,
): SyntaxError.Desc {
  return { type, syntaxId, msg }
}

export const functions: Record<string, FunctionDefine.Desc> = {
  createObject: {
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
    params: [{ forwardInput: true }],
    loopAfterParams: 1,
    loopParamsMustSameWithFirstWhenForwardInput: true,
    return: {
      scope: 'forwardParamsArray',
      item: { scope: 'forwardParams', paramsIndex: 0 },
    },
  },
  len: {
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: { type: 'number' },
  },
  round: {
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
  },
  random: {
    params: [],
    return: { type: 'number' },
  },
  anyToString: {
    params: [{ forwardInput: true }],
    return: { type: 'string' },
  },
}

export function getVarByPath(path: string[]) {
  let resVar = vars

  for (const key of path) {
    if (resVar.type !== 'object') return

    if (!resVar.prototype[key]) return

    resVar = resVar.prototype[key]
  }

  return resVar
}

export function getFunctionByName(name: string) {
  return functions[name]
}
