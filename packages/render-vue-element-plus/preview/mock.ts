import { WithDynamicVariable } from '@shuttle-formula/render'

export const mockVariablesDefine: Record<string, WithDynamicVariable> = {
  first: {
    type: 'object',
    label: '第一层第一个',
    prototype: {
      deep1: {
        type: 'boolean',
        label: '测试布尔',
      },
      deep2: {
        type: 'array',
        label: '测试数组',
        item: {
          type: 'object',
          prototype: {
            age: {
              type: 'number',
              label: '年龄',
            },
            name: {
              type: 'string',
              label: '姓名',
            },
          },
        },
      },
      deep3: {
        type: 'object',
        label: '多级对象',
        prototype: {
          inner: {
            type: 'number',
            label: '内部数字',
          },
        },
      },
    },
  },
  second: {
    type: 'number',
    label: '第一层第二个',
  },
}

export const mockVariablesValue = {
  first: {
    deep1: true,
    deep2: [
      {
        age: 10,
        name: '小明',
      },
      {
        age: 39,
        name: '小张',
      },
      {
        age: 7,
        name: '小李',
      },
    ],
    deep3: {
      inner: 100,
    },
  },
  second: 10,
}
