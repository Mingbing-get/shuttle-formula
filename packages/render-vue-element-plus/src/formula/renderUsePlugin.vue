<template>
  <FormulaRender
    :class="props.class"
    :style="props.style"
    :code="props.code"
    :functions="props.functions"
    :disabled="props.disabled"
    :variables="formulaVariables"
    :getDynamicObjectByPath="getDynamicObjectByPath"
    :accept="handleAccept"
  />
</template>

<script lang="ts">
import type { FormulaRenderProps } from './render.vue'

export interface FormulaRenderUsePluginProps extends Omit<
  FormulaRenderProps,
  'getDynamicObjectByPath' | 'accept' | 'variables'
> {
  accept?: {
    defines: VariablePlugin.Define[]
    exclude?: boolean
  }
  variables?: Record<string, VariablePlugin.Define>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { WithDynamicVariable } from '@shuttle-formula/render'
import {
  variablePluginManager,
  VariablePlugin,
} from '@shuttle-formula/variable-plugin'

import FormulaRender from './render.vue'

const props = defineProps<FormulaRenderUsePluginProps>()

const formulaVariables = computed(() =>
  variablePluginManager.recordToFormula(props.variables || {}),
)

const getDynamicObjectByPath =
  variablePluginManager.createGetDynamicObjectByPath()

const handleAccept = (returnType: WithDynamicVariable) => {
  if (!props.accept?.defines.length) return

  const acceptFn = variablePluginManager.createAccept(
    props.accept.defines,
    props.accept.exclude,
  )
  return acceptFn(returnType)
}
</script>
