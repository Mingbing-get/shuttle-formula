<script setup lang="ts">
import { provide } from 'vue'
import { Render, type RenderOption } from 'render'

const options = defineProps<RenderOption>()

provide('render', new Render(options))
</script>

<template>
  <slot></slot>
</template>
