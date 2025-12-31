## `@shuttle-formula/render`

#### 说明

该部分提供shuttle-formula的基础web渲染能力，提供灵活的插件入口，可在此基础上扩展能力，定制化公式编辑器

#### 安装

```bash
npm install @shuttle-formula/render
```

#### 使用

```ts
import { Render } from '@shuttle-formula/render'

const render = new Render({
  useWorker: true, // 设置是否使用web worker进行语法分析，当表达式很长时可使得编辑不会卡顿
})

render.setDomStyle(
  'border-radius: 5px; box-shadow: 0 0 6px 0 #ccc; width: 400px',
)

const root = document.createElement('div')
root.setAttribute('style', 'display: flex; justify-content: center;')
render.mount(root)

document.body.append(root)
```

##### 设置变量

[变量说明](#变量说明)

```ts
// 设置自定义变量的描述，使得编辑器知道有哪些变量，以及这些变量的类型，用于语法检查以及提示；由于此处不涉及到计算，所以不需要变量的值

import {
  WithDynamicVariable,
  GetDynamicObjectByPath,
} from '@shuttle-formula/render'

const variables: Record<string, WithDynamicVariable> = {
  a: {
    type: 'object',
    label: '变量的label',
    prototype: {
      c: {
        type: 'number',
      },
      e: {
        type: 'object',
        dynamic: true, // object变量可设置dynamic，表示该变量的属性通过远程获取，只有当用到该变量时才会去获取
      },
    },
  },
}

const getDynamicObjectByPath: GetDynamicObjectByPath = (path, define) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (path[0] === 'a' && path[1] === 'e') {
        resolve({
          type: 'object',
          prototype: {
            test: {
              label: '测试异步',
              type: 'number',
            },
          },
        })
      } else {
        resolve(undefined)
      }
    }, 500)
  })
}

// 将定义的变量添加到渲染器中
render.setVariables(variables)
// 将获取异步变量的方法添加到渲染器中，若不存在异步变量可不设置
render.setGetDynamicObjectByPath(getDynamicObjectByPath)
```

##### 设置函数

[函数说明](#函数说明)

```ts
// 设置自定义函数的描述，使得编辑器知道有哪些函数，以及这些函数的入参以及返回值类型，用于语法检查以及提示；由于此处不涉及到计算，所以不需要函数的值
import { VariableDefine, SyntaxError } from '@shuttle-formula/core'
import { WithLabelFunction, FunctionGroup } from '@shuttle-formula/render'

function createError(
  type: SyntaxError.Desc['type'],
  syntaxId: string,
  msg: string,
): SyntaxError.Desc {
  return { type, syntaxId, msg }
}

const functionWithGroups: FunctionGroup[] = [
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

// 将定义的函数组添加到render中
render.setFunctions(functionWithGroups)

// 或者直接设置函数，不使用分组
// const functions: Record<string, WithLabelFunction> = {}
// render.setFunctions(functions)
```

##### 自定义token渲染

```ts
import { TokenBaseRender } from '@shuttle-formula/render'

class CustomTokenRender extends TokenBaseRender<TokenDesc> {
  static TokenType = 'token-type'
}

render.useTokenRender(CustomTokenRender)
```

##### 自定义error渲染

```ts
import { ErrorDisplay } from '@shuttle-formula/render'

class ErrorDisplayClass implements ErrorDisplay {
  // 自定义逻辑
}

render.errorRender.setDisplayFactory(ErrorDisplayClass)
```

##### 自定义函数提示和变量提示

```ts
const functionWrapper = document.createElement('div')
render.tipRender.setFunctionPicker({
  updateTipOption(tipOption) {},
  setOnSelect(onSelect) {},
  getRoot() {
    return functionWrapper
  },
})

const variableWrapper = document.createElement('div')
render.tipRender.setVariablePicker({
  updateTipOption(tipOption) {},
  setOnSelect(onSelect) {},
  getRoot() {
    return variableWrapper
  },
})
```

##### 公式计算帮助类

```ts
import { FormulaHelper } from '@shuttle-formula/render'

const formulaHelper = new FormulaHelper('formula code')

// 计算表达式的值
formulaHelper.computed({
  // variable: 所有依赖的变量的值
  // variableDefine： 所有依赖的变量的定义
  // function： 所有依赖的函数
  // getDynamicObjectByPath： 动态获取对象的方法
})

// 获取表达式的依赖变量、函数、并检查语法错误
formulaHelper.getDependceAndCheck({
  // variableDefine： 所有依赖的变量的定义
  // functionDefine： 所有依赖的函数的定义
  // getDynamicObjectByPath： 动态获取对象的方法
})
```

##### 变量说明

变量都支持label属性，用于提示

| 变量类型 | 其他属性                        | 说明     |
| -------- | ------------------------------- | -------- |
| number   | 无                              | 数字     |
| string   | 无                              | 字符串   |
| boolean  | 无                              | 布尔     |
| array    | item: 变量                      | 数组     |
| object   | prototype: Record<string, 变量> | 对象     |
| object   | dynamic: true                   | 异步对象 |

##### 函数说明

函数描述说明

| 属性                                        | 类型                | 说明                                                                                                        |
| ------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| params                                      | [Params](#params)[] | 函数参数定义                                                                                                |
| loopAfterParams                             | number              | 表示重复最后几个参数的类型                                                                                  |
| loopParamsMustSameWithFirstWhenForwardInput | boolean             | 当入参数定义为forwardInput时，同时又定义了loopAfterParams，表示后面的输入是否需要与第一个输入的数据类型相同 |
| return                                      | [Return](#return)   | 函数返回值说明                                                                                              |

<span id='params' style='color: skyblue'>Params</span>

```ts
// 基础params: 定义当前参数只能是指定类型或指定的多个类型
{
  define: { type: 变量类型 } | Array<{ type: 变量类型 }>
}

// 任意类型params: 根据用户实际输入的类型推断出参数的类型
{
  forwardInput: true
}
```

<span id='return' style='color: skyblue'>Return</span>

```ts
// ConfirmReturn: 直接定义好的数据类型，与变量类型相同（不支持动态类型）

// ForwardParamsReturn: 表示与第几个入参的类型相同
{
  scope: 'forwardParams'
  paramsIndex: number
}

// ForwardParamsArray: 以item为数据项类型的数组
{
  scope: 'forwardParamsArray'
  item: Return
}

// CustomReturn: 自定义返回值类型，具体声明可查看ts文件
{
  scope: 'customReturn'
  createType: () =>
    WithPromise<
      { pass: false; error: SyntaxError.Desc } | { pass: true; type: 变量类型 }
    >
}
```
