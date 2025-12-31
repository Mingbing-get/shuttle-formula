<template>
  <FormulaVariablePickerPanel
    :variablePath="props.option.path"
    :variables="props.option.startVariable"
  />
</template>

<script lang="ts">
import type { VariableTipOption } from '@shuttle-formula/render'
import { VariablePickerPanelProps } from './formulaVariablePickerPanel.vue'

interface BaseProps {
  option: VariableTipOption
}

export interface VariableSelectProps
  extends
    Omit<VariablePickerPanelProps, 'variablePath' | 'variables'>,
    BaseProps {}
</script>

<script setup lang="ts">
import FormulaVariablePickerPanel from './formulaVariablePickerPanel.vue'

const props = defineProps<BaseProps>()
</script>
