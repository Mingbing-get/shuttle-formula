<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { FunctionTipOption } from 'render'

import { FunctionSelectComponent } from './type'
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
      :onSelect="onSelectRef"
    />
  </Teleport>
</template>
