## `shuttle-formula/render-react`

#### 说明

提供对接react的渲染方式

#### 使用

```tsx
import {
  Render,
  Provider,
  VariableTip,
  FunctionTip,
  TokenRender,
  ErrorRender,
  TokenRenderProps,
  ErrorRenderComponentProps,

  // useRender: 能获得shuttle-formula/render中的Render对象，可扩展自定义功能
} from 'shuttle-formula/render-react'

import { BooleanTokenDesc, BooleanTokenParse } from 'shuttle-formula/core'

function Example() {
  return (
    <Provider>
      <Render
        style={{ borderRadius: 5, boxShadow: '0 0 6px 0 #ccc', width: 400 }}
      />
      <VariableTip />
      <FunctionTip />
      <ErrorRender RenderComponent={TestErrorRender} />
      <TokenRender
        useTokenType={BooleanTokenParse.Type}
        RenderComponent={TestTokenTender}
      />
    </Provider>
  )
}

function TestTokenTender({ token, type }: TokenRenderProps<BooleanTokenDesc>) {
  return <span style={{ color: 'red' }}>{token.code}</span>
}

function TestErrorRender({ error }: ErrorRenderComponentProps) {
  return <div style={{ color: 'blue' }}>自定义错误提示: {error?.msg}</div>
}
```
