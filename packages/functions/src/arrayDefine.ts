import { VariableDefine } from '@shuttle-formula/core'

import { createError, deepCompareType, isItemsArray } from './utils'
import stringFunctionDefines from './stringDefine'
import { FunctionDescription, FunctionGroup } from './type'

const arrayFunctionDefines: FunctionGroup<FunctionDescription>['functions'] = {
  createArray: {
    label: '创建数组',
    params: [{ forwardInput: true }],
    loopAfterParams: 1,
    loopParamsMustSameWithFirstWhenForwardInput: true,
    return: {
      scope: 'customReturn',
      createType: async (getType, ...params) => {
        const firstParams = params[0]
        const firstType = await getType(firstParams?.id || '')
        if (!firstType) {
          return {
            pass: false,
            error: createError(
              'functionError',
              firstParams?.id || '',
              '未找到参数类型',
            ),
          }
        }

        for (let i = 1; i < params.length; i++) {
          const paramsValue = await getType(params[i]?.id || '')
          if (!paramsValue) {
            return {
              pass: false,
              error: createError(
                'functionError',
                params[i]?.id || '',
                '未找到参数类型',
              ),
            }
          }

          if (!deepCompareType(firstType, paramsValue)) {
            return {
              pass: false,
              error: createError(
                'functionError',
                params[i]?.id || '',
                '参数类型与第一个不一致',
              ),
            }
          }
        }

        return {
          pass: true,
          type: {
            type: 'array',
            item: firstType,
          },
        }
      },
    },
    description: {
      define: {
        paramsList: ['...T'],
        result: 'Array<T>',
      },
      detail: '手动创建数组, 数组的每个元素必须是相同的类型; T: any',
      examples: [
        { params: ['1', '2', '3'], result: '[1, 2, 3]' },
        {
          params: ['"ab"', '"123"', '"中文"'],
          result: '["ab", "123", "中文"]',
        },
      ],
    },
  },
  arrayContains: {
    label: '数组是否包含',
    params: [{ define: { type: 'array' } }, { forwardInput: true }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arrayParams, valueParams) => {
        const arrayType = await getType(arrayParams.id)
        if (!arrayType) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arrayParams.id,
              '未找到参数类型',
            ),
          }
        }

        if (arrayType.type !== 'array') {
          return {
            pass: false,
            error: createError(
              'functionError',
              arrayParams.id,
              '参数类型错误，应该为array',
            ),
          }
        }

        const valueType = await getType(valueParams.id)
        if (!valueType) {
          return {
            pass: false,
            error: createError(
              'functionError',
              valueParams.id,
              '未找到参数类型',
            ),
          }
        }

        if (!deepCompareType(arrayType.item, valueType)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              valueParams.id,
              '参数类型须为数组项的类型',
            ),
          }
        }

        return {
          pass: true,
          type: { type: 'boolean' },
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'T'],
        result: 'boolean',
      },
      detail: '判断指定元素是否在指定数组中; T: any',
      examples: [
        { params: ['@创建数组(1, 2, 3)', '1'], result: 'true' },
        { params: ['@创建数组("ab", "123", "中文")', 'cc'], result: 'false' },
      ],
    },
  },
  len: {
    label: '获取长度',
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: { type: 'number' },
    description: stringFunctionDefines['len'].description,
  },
  mergeArray: {
    label: '合并数组',
    params: [{ define: { type: 'array' } }],
    loopAfterParams: 1,
    return: {
      scope: 'customReturn',
      createType: async (getType, ...params) => {
        const firstParams = params[0]
        const firstType = await getType(firstParams?.id || '')
        if (!firstType) {
          return {
            pass: false,
            error: createError(
              'functionError',
              firstParams?.id || '',
              '未找到参数类型',
            ),
          }
        }

        if (firstType.type !== 'array') {
          return {
            pass: false,
            error: createError(
              'functionError',
              firstParams?.id || '',
              '参数类型错误，应该为array',
            ),
          }
        }

        for (let i = 1; i < params.length; i++) {
          const paramsValue = await getType(params[i]?.id || '')
          if (!paramsValue) {
            return {
              pass: false,
              error: createError(
                'functionError',
                params[i]?.id || '',
                '未找到参数类型',
              ),
            }
          }

          if (!deepCompareType(firstType, paramsValue)) {
            return {
              pass: false,
              error: createError(
                'functionError',
                params[i]?.id || '',
                '参数类型与第一个不一致',
              ),
            }
          }
        }

        return {
          pass: true,
          type: firstType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['...Array<T>'],
        result: 'Array<T>',
      },
      detail: '将多个相同类型的数组合并为一个数组; T: any',
      examples: [
        {
          params: ['@创建数组(1, 2, 3)', '@创建数组(2, 4, 5)'],
          result: '[1, 2, 3, 2, 4, 5]',
        },
      ],
    },
  },
  arrayGet: {
    label: '数组获取值',
    params: [{ define: { type: 'array' } }, { define: { type: 'number' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)
        if (arrType?.type !== 'array') {
          return {
            pass: false,
            error: createError('functionError', arr.id, '参数应该为array类型'),
          }
        }

        return {
          pass: true,
          type: arrType.item,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>'],
        result: 'T',
      },
      detail: '获取数组指定下标的值, 下标从0开始计数; T: any',
      examples: [
        { params: ['@创建数组(1, 2, 3)', '1'], result: '2' },
        {
          params: ['@创建数组("abc", "中文", "true")', '1'],
          result: '"中文"',
        },
      ],
    },
  },
  reverse: {
    label: '翻转',
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: {
      scope: 'forwardParams',
      paramsIndex: 0,
    },
    description: stringFunctionDefines['reverse'].description,
  },
  subArray: {
    label: '获取子数组',
    params: [
      { define: { type: 'array' } },
      { define: { type: 'number' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 0,
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'number', 'number'],
        result: 'Array<T>',
      },
      detail:
        '从数组中截取子数组, 位置从0开始计数, 第二个参数表示从第几个位置开始, 第三个参数表示截取的长度; T: any',
      examples: [
        {
          tip: '从第一个位置开始截取长度为2的子数组',
          params: ['@创建数组(1, 2, 3, 4)', '1', '2'],
          result: '[2, 3]',
        },
        {
          tip: '若截取的长度超过数组长度则获取的子数组将从开始位置到数组的末尾',
          params: ['@创建数组(1, 2, 3, 4)', '1', '8'],
          result: '[2, 3, 4]',
        },
        {
          tip: '若截取的位置是负数, 则表示从右数第几个位置开始',
          params: ['@创建数组(1, 2, 3, 4)', '-3', '2'],
          result: '[2, 3]',
        },
        {
          tip: '若截取的长度是负数, 则表示从开始位置到数组的末尾',
          params: ['@创建数组(1, 2, 3, 4)', '1', '-1'],
          result: '[2, 3, 4]',
        },
      ],
    },
  },
  sort: {
    label: '数组排序',
    params: [{ define: { type: 'array' } }, { define: { type: 'boolean' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)
        const arrItemTypes: VariableDefine.Desc['type'][] = [
          'number',
          'string',
          'custom-date',
          'custom-datetime',
        ]
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: arrType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'boolean'],
        result: 'Array<T>',
      },
      detail:
        '数组排序, 第二个参数表示是否降序排列; T: number | string | date | datetime',
      examples: [
        { params: ['@创建数组(1, 3, 2)', 'false'], result: '[1, 2, 3]' },
        {
          params: ['@创建数组("ab", "cd", "de")', 'true'],
          result: '["de", "cd", "ab"]',
        },
      ],
    },
  },
  substract: {
    label: '数组差集',
    params: [{ define: { type: 'array' } }, { define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr1, arr2) => {
        const arrType = await getType(arr1.id)
        const arr2Type = await getType(arr2.id)
        const arrItemTypes: VariableDefine.Desc['type'][] = [
          'number',
          'string',
          'custom-date',
          'custom-datetime',
          'custom-enum',
        ]
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr1.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        if (
          arr2Type?.type !== 'array' ||
          arrType.item.type !== arr2Type.item.type
        ) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr2.id,
              '参数类型应该与第一个一致',
            ),
          }
        }

        return {
          pass: true,
          type: arrType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'Array<T>'],
        result: 'Array<T>',
      },
      detail:
        '将在第一个数组中且不再第二个数组中的数据组合成一个新数组; T: number | string | date | datetime | enum',
      examples: [
        {
          params: ['@创建数组(1, 2, 3)', '@创建数组(2, 4, 5)'],
          result: '[1, 3]',
        },
        {
          params: ['@创建数组("ab", "cd")', '@创建数组("ab", "cd", "de")'],
          result: '[]',
        },
      ],
    },
  },
  arraySum: {
    label: '数组和',
    params: [{ define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = ['number']
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: {
            type: 'number',
          },
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<number>'],
        result: 'number',
      },
      detail: '将数组的所有元素相加',
      examples: [{ params: ['@创建数组(1, 2, 3)'], result: '6' }],
    },
  },
  arrayAvg: {
    label: '数组均值',
    params: [{ define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = ['number']
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: {
            type: 'number',
          },
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<number>'],
        result: 'number',
      },
      detail: '计算数组中所有元素的平均值',
      examples: [{ params: ['@创建数组(1, 2, 3)'], result: '2' }],
    },
  },
  arrayMin: {
    label: '数组最小值',
    params: [{ define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = ['number']
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: {
            type: 'number',
          },
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<number>'],
        result: 'number',
      },
      detail: '查找数组中所有元素的最小值',
      examples: [{ params: ['@创建数组(1, 2, 3)'], result: '1' }],
    },
  },
  arrayMax: {
    label: '数组最大值',
    params: [{ define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = ['number']
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: {
            type: 'number',
          },
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<number>'],
        result: 'number',
      },
      detail: '查找数组中所有元素的最大值',
      examples: [{ params: ['@创建数组(1, 2, 3)'], result: '3' }],
    },
  },
  unique: {
    label: '数组去重',
    params: [{ define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr) => {
        const arrType = await getType(arr.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = [
          'number',
          'string',
          'custom-date',
          'custom-datetime',
          'custom-enum',
        ]
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        return {
          pass: true,
          type: arrType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>'],
        result: 'Array<T>',
      },
      detail:
        '删除数组中重复的元素; T: number | string | date | datetime | enum',
      examples: [
        {
          params: ['@创建数组(1, 2, 3, 3, 4, 5, 4)'],
          result: '[1, 2, 3, 4, 5]',
        },
        { params: ['@创建数组("ab", "cd", "cd")'], result: '["ab", "cd"]' },
      ],
    },
  },
  hasAllOf: {
    label: '是否全部包含',
    params: [{ define: { type: 'array' } }, { define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr1, arr2) => {
        const arrType = await getType(arr1.id)
        const arr2Type = await getType(arr2.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = [
          'number',
          'string',
          'custom-date',
          'custom-datetime',
          'custom-enum',
        ]
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr1.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        if (
          arr2Type?.type !== 'array' ||
          arrType.item.type !== arr2Type.item.type
        ) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr2.id,
              '参数类型应该与第一个一致',
            ),
          }
        }

        return {
          pass: true,
          type: arrType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'Array<T>'],
        result: 'boolean',
      },
      detail:
        '判断第二个数组中的所有元素是否都在第一个数组中; T: number | string | date | datetime | enum',
      examples: [
        {
          params: ['@创建数组(1, 2, 3, 4)', '@创建数组(2, 3)'],
          result: 'true',
        },
        {
          params: ['@创建数组("ab", "cd")', '@创建数组("cd", "extra")'],
          result: 'false',
        },
      ],
    },
  },
  hasAnyOf: {
    label: '是否存在交集',
    params: [{ define: { type: 'array' } }, { define: { type: 'array' } }],
    return: {
      scope: 'customReturn',
      createType: async (getType, arr1, arr2) => {
        const arrType = await getType(arr1.id)
        const arr2Type = await getType(arr2.id)

        const arrItemTypes: VariableDefine.Desc['type'][] = [
          'number',
          'string',
          'custom-date',
          'custom-datetime',
          'custom-enum',
        ]
        if (!isItemsArray(arrType, arrItemTypes)) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr1.id,
              `参数应该为 array<${arrItemTypes.join('|')}> 类型`,
            ),
          }
        }

        if (
          arr2Type?.type !== 'array' ||
          arrType.item.type !== arr2Type.item.type
        ) {
          return {
            pass: false,
            error: createError(
              'functionError',
              arr2.id,
              '参数类型应该与第一个一致',
            ),
          }
        }

        return {
          pass: true,
          type: arrType,
        }
      },
    },
    description: {
      define: {
        paramsList: ['Array<T>', 'Array<T>'],
        result: 'boolean',
      },
      detail:
        '判断两个数组是否存在交集; T: number | string | date | datetime | enum',
      examples: [
        {
          params: ['@创建数组(1, 2, 3, 4)', '@创建数组(2, 3)'],
          result: 'true',
        },
        {
          params: ['@创建数组("ab", "cd")', '@创建数组("aaa", "extra")'],
          result: 'false',
        },
      ],
    },
  },
}

export default arrayFunctionDefines
