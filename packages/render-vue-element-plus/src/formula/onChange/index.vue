<template></template>

<script lang="ts">
export interface TokenInfo {
  code: string
  tokens: TokenDesc<string>[]
  firstUpdateIndex: number
  insertCount: number
  deleteCount: number
}

export interface AstInfo {
  ast: SyntaxAst
  error?: WithTokenError
  typeMap?: Map<string, VariableDefine.Desc>
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { TokenDesc, VariableDefine } from '@shuttle-formula/core'
import { SyntaxAst, WithTokenError } from '@shuttle-formula/render'
import { useRender } from '@shuttle-formula/render-vue'

const emit = defineEmits<{
  (e: 'tokenChange', tokenInfo: TokenInfo): void
  (e: 'astChange', astInfo: AstInfo): void
}>()

const { render } = useRender()

const handleTokenChange = (tokenInfo: TokenInfo) => {
  emit('tokenChange', tokenInfo)
}

const handleAstChange = (astInfo: AstInfo) => {
  emit('astChange', astInfo)
}

onMounted(() => {
  render.codeManager.addListener('changeToken', handleTokenChange)
  render.codeManager.addListener('changeAst', handleAstChange)
})

onBeforeUnmount(() => {
  render.codeManager.removeListener('changeToken', handleTokenChange)
  render.codeManager.removeListener('changeAst', handleAstChange)
})
</script>
