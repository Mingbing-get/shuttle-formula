<template>
  <div class="variable-render-error">{{ props.tip }}</div>
</template>

<script setup lang="ts">
interface Props {
  tip?: string
}

const props = defineProps<Props>()
</script>
