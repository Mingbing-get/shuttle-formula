<template>
  <span style="display: flex; align-items: center; justify-content: center">
    <svg v-bind="attrs" width="1em" height="1em" fill="currentColor">
      <slot />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
defineOptions({
  inheritAttrs: false,
})
const attrs = useAttrs()
</script>
