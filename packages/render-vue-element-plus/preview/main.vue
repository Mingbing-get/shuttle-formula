<template>
  <div
    style="
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      justify-content: center;
    "
  >
    <div style="width: 70vw">
      <FormulaRender
        :functions="functionWithGroups"
        :variables="mockVariablesDefine"
        @astChange="
          (ast) => {
            console.log('ast: ', ast)
          }
        "
        @tokenChange="
          (tokenInfo) => {
            codeRef = tokenInfo.code
            console.log('token info: ', tokenInfo)
          }
        "
      />
    </div>
    <ElButton type="primary" @click="handleComputed"> 计算 </ElButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

import { functionWithGroups, functionValues } from '@shuttle-formula/functions'
import { FormulaHelper } from '@shuttle-formula/render'
import { FormulaRender } from '../src'
import { mockVariablesDefine, mockVariablesValue } from './mock'

import 'element-plus/es/components/button/style/css'

const codeRef = ref('')

const handleComputed = async () => {
  const formulaHelper = new FormulaHelper(codeRef.value)

  const result = await formulaHelper.computed({
    variable: mockVariablesValue,
    variableDefine: mockVariablesDefine,
    function: functionValues,
  })

  const dependce = await formulaHelper.getDependceAndCheck({
    variableDefine: mockVariablesDefine,
    functionDefine: functionWithGroups,
  })

  console.log('计算结果: ', result)
  console.log('依赖: ', dependce)
}
</script>
