import { FunctionGroup } from 'render'

import stringFunctionDefines from './stringDefine'
import dateFunctionDefines from './dateDefine'
import objectFunctionDefines from './objectDefine'
import arrayFunctionDefines from './arrayDefine'
import transformFunctionDefines from './transformDefine'
import mathFunctionDefines from './mathDefine'
import logicFunctionDefines from './logicDefine'

export { default as functionValues } from './value'

export const functionWithGroups: FunctionGroup<React.ReactNode>[] = [
  {
    id: 'string',
    label: '文本函数',
    functions: stringFunctionDefines,
  },
  {
    id: 'date',
    label: '日期函数',
    functions: dateFunctionDefines,
  },
  {
    id: 'object',
    label: '对象函数',
    functions: objectFunctionDefines,
  },
  {
    id: 'array',
    label: '数组函数',
    functions: arrayFunctionDefines,
  },
  {
    id: 'transform',
    label: '类型转换',
    functions: transformFunctionDefines,
  },
  {
    id: 'math',
    label: '数学函数',
    functions: mathFunctionDefines,
  },
  {
    id: 'logic',
    label: '逻辑函数',
    functions: logicFunctionDefines,
  },
]
