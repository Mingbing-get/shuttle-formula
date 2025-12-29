## `shuttle-formula/render-react-antd`

#### 说明

提供对接react的渲染方式，基于antd组件库

#### 使用

```tsx
import { FormulaRender } from '@shuttle-formula/render-react-antd'

function main() {
  return (
    <FormulaRender
      {/* functions={自定义支持的函数，可从@shuttle-formula/functions中引入内置的函数} */}
      {/* variables={自定义支持的变量} */}
      onAstChange={(ast) => {
        console.log('ast: ', ast)
      }}
      onTokenChange={(tokenInfo) => {
        {
          /* 实时输入的公式
          tokenInfo.code */
        }

        console.log(tokenInfo)
      }}
    />
  )
}
```
