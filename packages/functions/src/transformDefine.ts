import { FunctionGroup } from 'render'

import { FunctionDescription } from './type'

const transformFunctionDefines: FunctionGroup<FunctionDescription>['functions'] =
  {
    anyToString: {
      label: '转为字符串',
      params: [
        {
          define: [
            { type: 'boolean' },
            { type: 'number' },
            { type: 'string' },
            { type: 'custom-date' },
            { type: 'custom-datetime' },
            { type: 'custom-enum' },
          ],
        },
      ],
      return: { type: 'string' },
      description: {
        define: {
          paramsList: ['boolean | number | string | date | datetime | enum'],
          result: 'string',
        },
        detail: '将参数转换为字符串',
        examples: [
          { tip: '字符串转换后是其本身', params: ['"abc"'], result: '"abc"' },
          { tip: '数字转换', params: ['1'], result: '"1"' },
          { tip: '布尔类型转换', params: ['true'], result: '"true"' },
        ],
      },
    },
    toNumber: {
      label: '转为数字',
      params: [
        {
          define: [{ type: 'number' }, { type: 'string' }, { type: 'boolean' }],
        },
      ],
      return: { type: 'number' },
      description: {
        define: {
          paramsList: ['number | string | boolean'],
          result: 'number',
        },
        detail: '将参数转换为数字',
        examples: [
          { tip: '数字转换后是其本身', params: ['1'], result: '1' },
          {
            tip: '只包含数字的字符串字符串才能转换成数字',
            params: ['"123"'],
            result: '123',
          },
          {
            tip: '布尔类型转换, true:1, false:0',
            params: ['true'],
            result: '1',
          },
        ],
      },
    },
    toJsonString: {
      label: '转为json字符串',
      params: [{ define: [{ type: 'array' }, { type: 'object' }] }],
      return: { type: 'string' },
      description: {
        define: {
          paramsList: ['Array<any> | Record<string, any>'],
          result: 'string',
        },
        detail: '将数组或对象转换为json字符串',
        examples: [
          {
            tip: '数组转换即JSON.stringify',
            params: ['@创建数组(1, 2, 3, 4)'],
            result: '"[1,2,3,4]"',
          },
          {
            tip: '对象转换即JSON.stringify',
            params: ['@创建对象("key1", 2, "key2", "abc")'],
            result: '\'{"key1":2,"key2":"abc"}\'',
          },
        ],
      },
    },
    toDate: {
      label: '转为日期',
      params: [
        {
          define: [
            { type: 'string' },
            { type: 'number' },
            { type: 'custom-datetime' },
          ],
        },
      ],
      return: { type: 'custom-date' },
      description: {
        define: {
          paramsList: ['string | number | datetime'],
          result: 'date',
        },
        detail:
          '将字符串、数字、日期时间转换为日期类型, 字符串格式: yyyy-MM-dd HH:mm:ss(或者其他能直接被日期对象解析的字符串), 数字: 时间戳',
        examples: [
          { params: ['"2022-10-10"'], result: '2022-10-10' },
          { params: ['1665360000000'], result: '2022-10-10' },
        ],
      },
    },
    toDateTime: {
      label: '转为日期时间',
      params: [
        {
          define: [
            { type: 'string' },
            { type: 'number' },
            { type: 'custom-date' },
          ],
        },
      ],
      return: { type: 'custom-datetime' },
      description: {
        define: {
          paramsList: ['string | number | date'],
          result: 'datetime',
        },
        detail:
          '将字符串、数字、日期转换为日期时间类型, 字符串格式: yyyy-MM-dd HH:mm:ss(或者其他能直接被日期对象解析的字符串), 数字: 时间戳',
        examples: [
          { params: ['"2022-10-10"'], result: '2022-10-10 00:00:00' },
          { params: ['1665360000000'], result: '2022-10-10 00:00:00' },
        ],
      },
    },
  }

export default transformFunctionDefines
