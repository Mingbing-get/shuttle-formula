<script setup lang="ts">
import { BooleanTokenParse } from '@shuttle-formula/core'
import { Provider, Render, ErrorRender, TokenRender, FunctionTip } from '../src'
import { vars, functionWithGroups, getDynamicObjectByPath } from './mock'
import ErrorTip from './errorTip.vue'
import BooleanTokenRender from './booleanTokenRender.vue'
import FunctionSelect from './functionSelect.vue'
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 10px;
    "
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 24px;
      "
    >
      <span style="margin-bottom: 12px">不使用worker</span>
      <Provider
        :variables="vars"
        :functions="functionWithGroups"
        :get-dynamic-object-by-path="getDynamicObjectByPath"
      >
        <Render
          style="border-radius: 5px; box-shadow: 0 0 6px 0 #ccc; width: 400px"
        />
        <ErrorRender :render-component="ErrorTip" />
        <TokenRender
          :render-component="BooleanTokenRender"
          :use-token-type="BooleanTokenParse.Type"
        />
        <FunctionTip :function-select="FunctionSelect" />
      </Provider>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center">
      <span style="margin-bottom: 12px">使用worker</span>
      <Provider
        use-worker
        :variables="vars"
        :functions="functionWithGroups"
        :get-dynamic-object-by-path="getDynamicObjectByPath"
      >
        <Render
          style="border-radius: 5px; box-shadow: 0 0 6px 0 #ccc; width: 400px"
        />
      </Provider>
    </div>
  </div>
</template>
