<template>
  <ElPopover
    v-model:visible="visible"
    placement="right"
    width="420px"
    :disabled="!props.extraTip"
    :show-after="200"
  >
    <template #reference>
      <div
        v-bind="attrs"
        class="function-select-option"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
      >
        <span>{{ props.label || props.value }}</span>
      </div>
    </template>

    <component :is="props.extraTip" />
  </ElPopover>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { ElPopover } from 'element-plus'

import { SelectOption } from './type'

import 'element-plus/es/components/popover/style/css'

interface Props extends SelectOption {}

const emit = defineEmits<{
  (e: 'click', value: string): void
  (e: 'mouseenter', value: string): void
}>()

const props = defineProps<Props>()
const attrs = useAttrs()
const visible = ref(false)

const handleClick = (e: MouseEvent) => {
  e.stopPropagation()

  emit('click', props.value)
  visible.value = false
}

const handleMouseEnter = (e: MouseEvent) => {
  e.stopPropagation()

  emit('mouseenter', props.value)
}
</script>
