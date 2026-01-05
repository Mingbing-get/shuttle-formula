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
      :accept="accept"
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

<script lang="ts">
import type { VariableDefine } from '@shuttle-formula/core'
import type {
  FunctionGroup,
  WithLabelFunction,
  FunctionDescription,
} from '@shuttle-formula/functions'
import type {
  GetDynamicObjectByPath,
  WithDynamicVariable,
} from '@shuttle-formula/render'

export interface FormulaRenderProps {
  class?: string
  style?: string
  code?: string
  getDynamicObjectByPath?: GetDynamicObjectByPath
  accept?:
    | VariableDefine.Desc
    | VariableDefine.Desc[]
    | ((returnType: WithDynamicVariable) => string | undefined)
  variables?: Record<string, WithDynamicVariable>
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { Provider, VariableTip, FunctionTip } from '@shuttle-formula/render-vue'

import FunctionSelect from './functionSelect/index.vue'
import VariableSelect from './variableSelect/index.vue'
import OnChange, { TokenInfo, AstInfo } from './onChange/index.vue'
import RenderEditor from './renderEditor/index.vue'

defineProps<FormulaRenderProps>()
const emit = defineEmits<{
  (e: 'tokenChange', tokenInfo: TokenInfo): void
  (e: 'astChange', astInfo: AstInfo): void
}>()
</script>
