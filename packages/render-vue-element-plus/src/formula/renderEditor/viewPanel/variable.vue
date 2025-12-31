<template>
  <div class="formula-variable-wrapper">
    <FormulaVariablePickerPanel
      v-bind="attrs"
      :openPath="openPath"
      :openOnSelectPath="false"
      @open="(v) => (openPath = v)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import FormulaVariablePickerPanel from '../../variableSelect/formulaVariablePickerPanel.vue'

const openPath = ref<string[]>()
const attrs = useAttrs()
</script>
