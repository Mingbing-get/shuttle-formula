import { FunctionGroup } from 'render'

import FunctionDescription from './description'

const stringFunctionDefines: FunctionGroup<React.ReactNode>['functions'] = {
  len: {
    label: '获取长度',
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: { type: 'number' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'len',
          name: '获取长度',
          paramsList: ['string | Array<any>'],
          result: 'number',
        }}
        detail="获取字符串长度、数组项的个数"
        examples={[
          { tip: '获取字符串长度', params: ['"abc"'], result: '3' },
          {
            tip: '获取数组长度',
            params: ['@创建数组(1, 2, 3, 4)'],
            result: '4',
          },
        ]}
      />
    ),
  },
  reverse: {
    label: '翻转',
    params: [{ define: [{ type: 'string' }, { type: 'array' }] }],
    return: {
      scope: 'forwardParams',
      paramsIndex: 0,
    },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'reverse',
          name: '翻转',
          paramsList: ['T'],
          result: 'T',
        }}
        detail="翻转字符串、数组 (T: string | Array<any>)"
        examples={[
          { tip: '翻转字符串', params: ['"abc"'], result: '"cba"' },
          {
            tip: '翻转数组',
            params: ['@创建数组(1, 2, 3, 4)'],
            result: '[4, 3, 2, 1]',
          },
        ]}
      />
    ),
  },
  mergeString: {
    label: '合并字符串',
    params: [{ define: { type: 'string' } }],
    loopAfterParams: 1,
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'mergeString',
          name: '合并字符串',
          paramsList: ['...string'],
          result: 'string',
        }}
        detail="将多个字符串合并为一个字符串"
        examples={[
          { params: ['"abc"', '"123"', '"中文"'], result: '"abc123中文"' },
        ]}
      />
    ),
  },
  contains: {
    label: '是否包含',
    params: [{ define: { type: 'string' } }, { define: { type: 'string' } }],
    return: { type: 'boolean' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'contains',
          name: '是否包含',
          paramsList: ['string', 'string'],
          result: 'boolean',
        }}
        detail="判断字符串中是否包含子字符串"
        examples={[
          {
            tip: '包含, 第一个字符串中出现了第二个字符串',
            params: ['"abcdef"', '"bcd"'],
            result: 'true',
          },
          {
            tip: '不包含, 第一个字符串中没有第二个字符串',
            params: ['"abcdef"', '"123"'],
            result: 'false',
          },
        ]}
      />
    ),
  },
  stringIndex: {
    label: '查找文本位置',
    params: [{ define: { type: 'string' } }, { define: { type: 'string' } }],
    return: { type: 'number' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'stringIndex',
          name: '查找文本位置',
          paramsList: ['string', 'string'],
          result: 'number',
        }}
        detail="在第一个字符串中查找第一次出现第二个字符串的位置, 位置从0开始计数, 若未查询到返回-1"
        examples={[
          {
            tip: '查询到第二个字符串',
            params: ['"abcdef"', '"bcd"'],
            result: '1',
          },
          {
            tip: '未查询到第二个字符串',
            params: ['"abcdef"', '"123"'],
            result: '-1',
          },
          {
            tip: '第二个字符串在第一个字符串中出现多次，值返回第一个的位置',
            params: ['"ab12cd12ef12"', '"12"'],
            result: '2',
          },
        ]}
      />
    ),
  },
  subString: {
    label: '获取子串',
    params: [
      { define: { type: 'string' } },
      { define: { type: 'number' } },
      { define: { type: 'number' } },
    ],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'subString',
          name: '获取子串',
          paramsList: ['string', 'number', 'number'],
          result: 'string',
        }}
        detail="从字符串中截取子字符串, 位置从0开始计数, 第二个参数表示从第几个位置开始, 第三个参数表示截取的长度"
        examples={[
          {
            tip: '从第一个位置开始截取长度为2的字符串',
            params: ['"abcdef"', '1', '2'],
            result: '"bc"',
          },
          {
            tip: '若截取的长度超过字符串则获取的字串将从开始位置到字符串的末尾',
            params: ['"abcdef"', '1', '8'],
            result: '"bcdef"',
          },
          {
            tip: '若截取的位置是负数, 则表示从右数第几个位置开始',
            params: ['"abcdef"', '-3', '2'],
            result: '"de"',
          },
          {
            tip: '若截取的长度是负数, 则表示从开始位置到字符串的末尾',
            params: ['"abcdef"', '1', '-1'],
            result: '"bcdef"',
          },
        ]}
      />
    ),
  },
  lower: {
    label: '转小写',
    params: [{ define: { type: 'string' } }],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'lower',
          name: '转小写',
          paramsList: ['string'],
          result: 'string',
        }}
        detail="将字符串中的大写字母全部转为小写字母"
        examples={[{ params: ['"AbCDef"'], result: '"abcdef"' }]}
      />
    ),
  },
  upper: {
    label: '转大写',
    params: [{ define: { type: 'string' } }],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'upper',
          name: '转大写',
          paramsList: ['string'],
          result: 'string',
        }}
        detail="将字符串中的小写字母全部转为大写字母"
        examples={[{ params: ['"AbCDef"'], result: '"ABCDEF"' }]}
      />
    ),
  },
  repeat: {
    label: '重复文本',
    params: [{ define: { type: 'string' } }, { define: { type: 'number' } }],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'repeat',
          name: '重复文本',
          paramsList: ['string', 'number'],
          result: 'string',
        }}
        detail="将指定字符串重复指定次数输出"
        examples={[
          { params: ['"abc"', '3'], result: '"abcabcabc"' },
          { params: ['"abc"', '0'], result: '""' },
        ]}
      />
    ),
  },
  trim: {
    label: '删除头尾空格',
    params: [{ define: { type: 'string' } }],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'trim',
          name: '删除头尾空格',
          paramsList: ['string'],
          result: 'string',
        }}
        detail="将指定字符串开头和结尾的字符串删除"
        examples={[{ params: ['"  a  bc "'], result: '"a  bc"' }]}
      />
    ),
  },
  replace: {
    label: '替换',
    params: [
      { define: { type: 'string' } },
      { define: { type: 'string' } },
      { define: { type: 'string' } },
    ],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'replace',
          name: '替换',
          paramsList: ['string', 'string', 'string'],
          result: 'string',
        }}
        detail="将字符串中的首个指定子字符串替换为指定的字符串"
        examples={[
          { params: ['"abcdef"', '"bc"', '"123"'], result: '"a123def"' },
          { params: ['"abcdebcf"', '"bc"', '"123"'], result: '"a123debcf"' },
        ]}
      />
    ),
  },
  replaceAll: {
    label: '替换所有',
    params: [
      { define: { type: 'string' } },
      { define: { type: 'string' } },
      { define: { type: 'string' } },
    ],
    return: { type: 'string' },
    description: (
      <FunctionDescription
        define={{
          functionKey: 'replaceAll',
          name: '替换所有',
          paramsList: ['string', 'string', 'string'],
          result: 'string',
        }}
        detail="将字符串中的所有指定子字符串替换为指定的字符串"
        examples={[
          { params: ['"abcdef"', '"bc"', '"123"'], result: '"a123def"' },
          { params: ['"abcdebcf"', '"bc"', '"123"'], result: '"a123de123f"' },
        ]}
      />
    ),
  },
}

export default stringFunctionDefines
