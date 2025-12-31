<template>
  <Provider
    :disabled="disabled"
    :code="code"
    :variables="variables"
    :functions="functions"
    :getDynamicObjectByPath="getDynamicObjectByPath"
  >
    <RenderEditor
      :style="style"
      :class="class"
      :needAccept="needAccept"
      :disabled="disabled"
    />
    <VariableTip :variableSelect="VariableSelect" />
    <FunctionTip :functionSelect="FunctionSelect" />
    <OnChange
      @astChange="(v) => emit('astChange', v)"
      @tokenChange="(v) => emit('tokenChange', v)"
    />
  </Provider>
</template>

<script setup lang="ts">
import { VariableDefine } from '@shuttle-formula/core'
import { Provider, VariableTip, FunctionTip } from '@shuttle-formula/render-vue'

import type {
  FunctionGroup,
  WithLabelFunction,
  FunctionDescription,
} from '@shuttle-formula/functions'
import type {
  GetDynamicObjectByPath,
  WithDynamicVariable,
} from '@shuttle-formula/render'

import FunctionSelect from './functionSelect/index.vue'
import VariableSelect from './variableSelect/index.vue'
import OnChange, { TokenInfo, AstInfo } from './onChange/index.vue'
import RenderEditor from './renderEditor/index.vue'

interface Props {
  class?: string
  style?: string
  code?: string
  getDynamicObjectByPath?: GetDynamicObjectByPath
  needAccept?: VariableDefine.Desc | VariableDefine.Desc[]
  variables?: Record<string, WithDynamicVariable>
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
  disabled?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'tokenChange', tokenInfo: TokenInfo): void
  (e: 'astChange', astInfo: AstInfo): void
}>()
</script>
