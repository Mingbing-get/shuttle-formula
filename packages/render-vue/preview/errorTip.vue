<script setup lang="ts">
import { ErrorRenderComponentProps } from '../src'

const { error } = defineProps<ErrorRenderComponentProps>()
</script>

<template>
  <div style="color: red">{{ error.msg }}</div>
</template>
