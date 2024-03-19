<script setup lang="ts">
import { BooleanTokenDesc } from 'core'
import { TokenRenderProps } from '../src'

const { token, type } = defineProps<TokenRenderProps<BooleanTokenDesc>>()
</script>

<template>
  <span style="color: aqua">{{ token.code }}</span>
</template>
