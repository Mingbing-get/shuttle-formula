import { FunctionGroup } from 'render'

import { createError, deepCompareType } from './utils'
import { FunctionDescription } from './type'

const logicFunctionDefines: FunctionGroup<FunctionDescription>['functions'] = {
  if: {
    label: '如果',
    params: [
      { forwardInput: true },
      { define: { type: 'boolean' } },
      { forwardInput: true },
    ],
    loopAfterParams: 2,
    return: {
      scope: 'customReturn',
      createType: async (getType, ...params) => {
        const firstParams = params[0]
        const firstType = await getType(firstParams.id)

        if (!firstType) {
          return {
            pass: false,
            error: createError('functionError', firstParams.id, '未获取到类型'),
          }
        }

        for (let i = 1; i < params.length; i += 2) {
          if (i + 1 >= params.length) {
            return {
              pass: false,
              error: createError(
                'functionError',
                params[i].id,
                '未匹配当前项的值',
              ),
            }
          }

          const nextParams = params[i + 1]
          const nextParamsType = await getType(nextParams.id)
          if (!nextParamsType) {
            return {
              pass: false,
              error: createError(
                'functionError',
                nextParams.id,
                '未找到参数类型',
              ),
            }
          }

          if (!deepCompareType(firstType, nextParamsType)) {
            return {
              pass: false,
              error: createError(
                'functionError',
                nextParams.id,
                '参数类型不能与第一个参数不同',
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
        paramsList: ['T', '...(boolean, T)'],
        result: 'T',
      },
      detail:
        '根据表达式的结果, 匹配值, 第一个为默认值, 若所有条件都不符合则返回默认值; T:any',
      examples: [
        { params: ['1', 'true', '3'], result: '3' },
        { params: ['1', 'false', '3'], result: '1' },
        {
          params: ['"a"', '10 < 5', '"b"', '"123" == 123', '"c"'],
          result: '"a"',
        },
      ],
    },
  },
  isBlank: {
    label: '是否为空',
    params: [{ forwardInput: true }],
    return: { type: 'boolean' },
    description: {
      define: {
        paramsList: ['any'],
        result: 'boolean',
      },
      detail: '判断传入的值是否为空',
      examples: [
        { params: ['1'], result: 'false' },
        { params: ['""'], result: 'true' },
        { params: ['null'], result: 'true' },
        { params: ['undefined'], result: 'true' },
      ],
    },
  },
  isNotBlank: {
    label: '是否不为空',
    params: [{ forwardInput: true }],
    return: { type: 'boolean' },
    description: {
      define: {
        paramsList: ['any'],
        result: 'boolean',
      },
      detail: '判断传入的值是否不为空',
      examples: [
        { params: ['1'], result: 'true' },
        { params: ['""'], result: 'false' },
        { params: ['null'], result: 'false' },
        { params: ['undefined'], result: 'false' },
      ],
    },
  },
  equals: {
    label: '是否相等',
    params: [{ forwardInput: true }],
    loopAfterParams: 1,
    loopParamsMustSameWithFirstWhenForwardInput: true,
    return: { type: 'boolean' },
    description: {
      define: {
        paramsList: ['...T'],
        result: 'boolean',
      },
      detail: '判断传入的值是否相等(深度比较), T: any',
      examples: [
        { params: ['1', '1'], result: 'true' },
        { params: ['"2"', '"2"', '"test"'], result: 'false' },
        { params: ['"abc"', '"abc"'], result: 'true' },
      ],
    },
  },
}

export default logicFunctionDefines
