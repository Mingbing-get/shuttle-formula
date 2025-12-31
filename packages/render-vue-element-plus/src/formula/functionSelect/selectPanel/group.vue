<template>
  <div class="function-select-group">
    <div class="function-select-group-header">
      <DownOutlined
        class="function-select-group-header-icon"
        @click="open = !open"
        :style="open ? undefined : 'rotate: -90deg'"
      />
      <span class="function-select-group-title">
        <slot name="title" />
      </span>
    </div>
    <div v-if="open" class="function-select-group-options">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DownOutlined from '../../../components/downOutlined.vue'

defineSlots<{
  title: () => any
  default: () => any
}>()

const open = ref(true)
</script>
