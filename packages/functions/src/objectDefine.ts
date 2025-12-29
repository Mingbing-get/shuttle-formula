import { FunctionGroup } from 'render'
import { SyntaxDescUtils, VariableDefine } from 'core'

import { createError } from './utils'
import { FunctionDescription } from './type'

const objectFunctionDefines: FunctionGroup<FunctionDescription>['functions'] = {
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
                '键名只能是常量字符串',
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
    description: {
      define: {
        paramsList: ['...(string, any)'],
        result: 'Record<string, any>',
      },
      detail: '手动创建对象',
      examples: [
        {
          params: ['"key1"', '1', '"key2"', '"abc"', '"key3"', 'true'],
          result: '{ key1: 1, key2: "abc", key3: true }',
        },
      ],
    },
  },
  keys: {
    label: '获取键名',
    params: [{ define: { type: 'object' } }],
    return: { type: 'array', item: { type: 'string' } },
    description: {
      define: {
        paramsList: ['Record<string, any>'],
        result: 'Array<string>',
      },
      detail: '获取对象的所有键名',
      examples: [
        {
          params: ['@创建对象("key1", 1, "key2", "abc", "key3", true)'],
          result: '["key1", "key2", "key3"]',
        },
      ],
    },
  },
  getValue: {
    label: '获取指定键的值',
    params: [{ define: { type: 'object' } }, { define: { type: 'string' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, objectSyntax, stringSyntax) => {
        const objectType = await getType(objectSyntax.id)

        if (!objectType) {
          return {
            pass: false,
            error: createError(
              'functionError',
              objectSyntax.id,
              '未找到参数类型',
            ),
          }
        }

        if (objectType.type !== 'object') {
          return {
            pass: false,
            error: createError(
              'functionError',
              objectSyntax.id,
              '参数类型错误，应该为object',
            ),
          }
        }

        if (
          !SyntaxDescUtils.IsConst(stringSyntax) ||
          stringSyntax.constType !== 'string'
        ) {
          return {
            pass: false,
            error: createError(
              'functionError',
              stringSyntax.id,
              '键名只能是常量字符串',
            ),
          }
        }

        const key = stringSyntax.valueTokens.map((token) => token.code).join('')
        if (!objectType.prototype[key]) {
          return {
            pass: false,
            error: createError(
              'functionError',
              stringSyntax.id,
              '键名在对象中不存在',
            ),
          }
        }

        return {
          pass: true,
          type: objectType.prototype[key],
        }
      },
    },
    description: {
      define: {
        paramsList: ['Record<string, any>', 'string'],
        result: 'any',
      },
      detail: '获取对象指定键对应的值',
      examples: [
        {
          params: [
            '@创建对象("key1", 1, "key2", "abc", "key3", true)',
            '"key1"',
          ],
          result: '1',
        },
      ],
    },
  },
  mergeObject: {
    label: '合并对象',
    params: [{ define: { type: 'object' } }],
    loopAfterParams: 1,
    return: {
      scope: 'customReturn',
      createType: async (getType, ...params) => {
        const defReturn: VariableDefine.Object = {
          type: 'object',
          prototype: {},
        }

        for (const item of params) {
          const objectType = await getType(item.id)
          if (!objectType) {
            return {
              pass: false,
              error: createError('functionError', item.id, '未找到参数类型'),
            }
          }

          if (objectType.type !== 'object') {
            return {
              pass: false,
              error: createError(
                'functionError',
                item.id,
                '参数类型错误，应该为object',
              ),
            }
          }

          defReturn.prototype = {
            ...defReturn.prototype,
            ...objectType.prototype,
          }
        }

        return {
          pass: true,
          type: defReturn,
        }
      },
    },
    description: {
      define: {
        paramsList: ['...Record<string, any>'],
        result: 'Record<string, any>',
      },
      detail: '将多个对象合并为一个对象',
      examples: [
        {
          params: [
            '@创建对象("key1", 1, "key2", "abc", "key3", true)',
            '@创建对象("key2", "after", "key4", "多的值")',
          ],
          result: '{ key1: 1, key2: "after", key3: true, key4: "多的值" }',
        },
      ],
    },
  },
}

export default objectFunctionDefines
