<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useRender from '../context/useRender'

const wrapper = ref<HTMLElement>()
const { render } = useRender()

onMounted(() => {
  if (!wrapper.value) return

  render.mount(wrapper.value)
})
</script>

<template>
  <div ref="wrapper" style="display: flex" />
</template>
