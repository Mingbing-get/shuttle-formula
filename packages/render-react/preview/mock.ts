import { SyntaxDescUtils } from 'core'

import type {
  WithDynamicVariable,
  WithLabelFunction,
  FunctionGroup,
  GetDynamicObjectByPath,
} from 'render'

import type { VariableDefine, SyntaxError } from 'core'

export const vars: Record<string, WithDynamicVariable> = {
  a: {
    type: 'object',
    label: '全局',
    prototype: {
      button: {
        type: 'object',
        label: '按钮',
        prototype: {
          c_test: {
            label: '测试',
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
  return new Promise((resolve) => {
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
    id: 'date',
    label: '日期函数',
    functions: {
      now: {
        label: '当前日期',
        params: [],
        return: { type: 'custom-date' },
      },
      formatDate: {
        label: '格式化时间',
        params: [
          { define: { type: 'custom-date' } },
          { define: { type: 'string' } },
        ],
        return: { type: 'string' },
      },
    },
  },
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

export const varValues: Record<string, any> = {
  a: {
    button: {
      c_test: 11,
    },
    d: 1,
    e: 2,
    f: 3,
  },
  b: 20,
  d: {
    c: 30,
    e: {
      test: 100,
    },
  },
}

export const functionValues: Record<string, Function> = {
  createObject(...params: [string, any]) {
    const res: Record<string, any> = {}

    for (let i = 0; i < params.length; i += 2) {
      res[params[i] as string] = params[i + 1]
    }

    return res
  },
  createArray(...params: any[]) {
    return params
  },
  len(v: string | Array<any>) {
    return v.length
  },
  round(v: number) {
    return Math.round(v)
  },
  random() {
    return Math.random()
  },
  anyToString(v: any) {
    return `${v}`
  },
  now() {
    return new Date()
  },
  formatDate(date: Date, format: string) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
      a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
      A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
    }
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length),
      )
    }
    for (const _k in o) {
      const k = _k as keyof typeof o
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k].toString()
            : ('00' + o[k]).substring(('' + o[k]).length),
        )
      }
    }
    return format
  },
}

export function getVar(path: string[]) {
  let v = varValues

  for (const key of path) {
    v = v[key]

    if (!v) return v
  }

  return v
}

export function getFunction(name: string) {
  return functionValues[name]
}
