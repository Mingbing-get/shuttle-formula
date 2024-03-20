<script setup lang="ts">
import type { BooleanTokenDesc } from 'core'
import type { TokenRenderProps } from '../src'

const { token } = defineProps<TokenRenderProps<BooleanTokenDesc>>()
</script>

<template>
  <span style="color: aqua">{{ token.code }}</span>
</template>
