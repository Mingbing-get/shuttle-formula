<script setup lang="ts">
import type { VariableTipOption } from '@shuttle-formula/render'
import type { VariableSelectComponent } from './type'

import { onBeforeMount, ref } from 'vue'
import useRender from '../context/useRender'

const { variableSelect } = defineProps<{
  variableSelect: VariableSelectComponent
}>()

const tipOption = ref<VariableTipOption>()
const onSelectRef = ref<(path: string[]) => void>()
const wrapper = ref(document.createElement('div'))
const { render } = useRender()

onBeforeMount(() => {
  render.tipRender.setVariablePicker({
    updateTipOption(option) {
      tipOption.value = option
    },
    setOnSelect(onSelect) {
      onSelectRef.value = onSelect
    },
    getRoot() {
      return wrapper.value
    },
  })
})
</script>

<template>
  <Teleport v-if="!!tipOption" :to="wrapper">
    <variableSelect
      :option="tipOption"
      :get-dynamic-object-by-path="render.getOption().getDynamicObjectByPath"
      @select="onSelectRef"
    />
  </Teleport>
</template>
