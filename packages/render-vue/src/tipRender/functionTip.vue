<script setup lang="ts">
import type { FunctionTipOption } from '@shuttle-formula/render'
import type { FunctionSelectComponent } from './type'

import { onBeforeMount, ref } from 'vue'
import useRender from '../context/useRender'

const { functionSelect } = defineProps<{
  functionSelect: FunctionSelectComponent
}>()

const tipOption = ref<FunctionTipOption>()
const onSelectRef = ref<(functionName: string) => void>()
const wrapper = ref(document.createElement('div'))
const { render } = useRender()

onBeforeMount(() => {
  render.tipRender.setFunctionPicker({
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
    <functionSelect
      :option="tipOption"
      :functions="render.getOption().functions"
      :on-select="onSelectRef"
    />
  </Teleport>
</template>
