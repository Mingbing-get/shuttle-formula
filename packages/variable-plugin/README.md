## `@shuttle-formula/variable-plugin`

公式编辑器变量插件

#### 内置插件类型

| 类型       | 描述             | 其他说明                              |
| ---------- | ---------------- | ------------------------------------- |
| `boolean`  | 布尔类型变量     | 对应公式的boolean类型                 |
| `datetime` | 日期时间类型变量 | 对应公式的custom-datetime类型         |
| `date`     | 日期类型变量     | 对应公式的custom-date类型             |
| `number`   | 数值类型变量     | 对应公式的number类型                  |
| `string`   | 字符串类型变量   | 对应公式的string类型                  |
| `array`    | 数组类型变量     | 对应公式的array类型, 有item属性       |
| `object`   | 对象类型变量     | 对应公式的object类型，有prototype属性 |

#### 扩展插件类型

```ts
// 扩展类型定义
export declare module '@shuttle-formula/variable-plugin' {
  export namespace VariablePlugin {
    export interface TestDefine extends BaseDefine<'test'> {}

    export interface DefineMap {
      test: TestDefine
    }
  }
}

// 实现类型转换工具
import { WithDynamicVariable } from '@shuttle-formula/render'

import {
  VariablePlugin,
  variablePluginManager,
} from '@shuttle-formula/variable-plugin'

export default class TestPlugin implements VariablePlugin.Instance<VariablePlugin.TestDefine> {
  is(define: VariablePlugin.Define): define is VariablePlugin.TestDefine {
    return define.type === 'test'
  }

  toFormula(define: VariablePlugin.TestDefine) {
    // 这里根据需要也可转换为公式其他内部类型
    return {
      type: 'custom-test' as `custom-${string}`,
      label: define.label,
      extra: define, // 将实际定义传递给公式的额外属性，可用于后续判断
    }
  }

  accept(returnType: WithDynamicVariable): boolean {
    return returnType.type === 'custom-test'
  }
}

// 将类型注册到变量的插件管理器中
variablePluginManager.use(new TestPlugin())
```
