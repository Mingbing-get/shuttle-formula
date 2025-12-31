<template>
  <span class="function-description-tip">{{ props.detail }}</span>
</template>
<script setup lang="ts">
interface Props {
  detail: string
}

const props = defineProps<Props>()
</script>
