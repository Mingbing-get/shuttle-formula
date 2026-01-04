import {
  WithDynamicVariable,
  WithDynamicVariableObject,
  GetDynamicObjectByPath,
  GetDynamicDefineAndValueByPath,
} from '@shuttle-formula/render'

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
      custom: {
        type: 'object',
        dynamic: true,
        label: '自定义对象_关联数据模型',
        extra: {
          lookupObjectId: '123',
        },
      },
    },
  },
  second: {
    type: 'number',
    label: '第一层第二个',
  },
}

export const getDynamicObjectByPath: GetDynamicObjectByPath = async (
  path: string[],
  dynamicObjectDefine: WithDynamicVariableObject,
) => {
  if (dynamicObjectDefine.extra?.lookupObjectId === '123') {
    if (!cacheDefine[dynamicObjectDefine.extra.lookupObjectId]) {
      cacheDefine[dynamicObjectDefine.extra.lookupObjectId] = (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          type: 'object',
          label: dynamicObjectDefine.label || '自定义对象_关联数据模型',
          prototype: {
            id: {
              type: 'string',
              label: 'ID',
            },
            name: {
              type: 'string',
              label: '姓名',
            },
            age: {
              type: 'number',
              label: '年龄',
            },
          },
        }
      })()
    }

    return cacheDefine[dynamicObjectDefine.extra.lookupObjectId]
  }
}

export const getDynamicDefineAndValueByPath: GetDynamicDefineAndValueByPath =
  async (
    path: string[],
    dynamicObjectDefine: WithDynamicVariableObject,
    dynamicValue: any, // 原始数据
  ) => {
    if (dynamicObjectDefine.extra?.lookupObjectId === '123') {
      return {
        define: await getDynamicObjectByPath(path, dynamicObjectDefine),
        value: {
          id: '123',
          name: 'test_name',
          age: 39,
        },
      }
    }
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
    custom: {
      id: '123',
    },
  },
  second: 10,
}

const cacheDefine: Record<string, ReturnType<GetDynamicObjectByPath>> = {}
