## `@shuttle-formula/render-vue`

#### 说明

提供对接vue的渲染方式

#### 安装

```bash
npm install @shuttle-formula/render-vue
```

#### 使用

```vue
<script setup lang="ts">
import {
  Render,
  Provider,

  // VariableTip: 自定义变量提示
  // FunctionTip: 自定义函数提示
  // TokenRender: 自定义token渲染
  // ErrorRender: 自定义error渲染
  // useRender: 能获得shuttle-formula/render中的Render对象，可扩展自定义功能
} from '@shuttle-formula/render-vue'

import { BooleanTokenDesc, BooleanTokenParse } from '@shuttle-formula/core'
</script>

<template>
  <Provider>
    <Render
      style="border-radius: 5px; box-shadow: 0 0 6px 0 #ccc; width: 400px"
    />
  </Provider>
</template>
```
