## `shuttle-formula/render-vue-element-plus`

#### 说明

提供对接vue的渲染方式, 基于element-plus

#### 安装

```bash
npm install @shuttle-formula/render-vue-element-plus
```

#### 使用

```vue
<template>
<FormulaRender
  functions="自定义支持的函数，可从@shuttle-formula/functions中引入内置的函数"
  variables="自定义支持的变量"
  @astChange="(ast) => {
    console.log('ast: ', ast)
  }"
  @tokenChange="(tokenInfo) => {
    {
      /* 实时输入的公式
      tokenInfo.code */
    }

    console.log(tokenInfo)
  }"
/>
</template>

<script setup lang="ts">
import { FormulaRender } from '@shuttle-formula/render-react-antd'
</scritp>
```
