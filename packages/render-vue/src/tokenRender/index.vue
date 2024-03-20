<script setup lang="ts">
import type { Ref } from 'vue'
import type { TokenDesc } from 'core'
import type { TokenWithType, TokenRenderComponent } from './type'

import { onBeforeMount, ref } from 'vue'
import { TokenBaseRender } from 'render'
import useRender from '../context/useRender'

const { useTokenType, renderComponent } = defineProps<{
  useTokenType: string
  renderComponent: TokenRenderComponent<any>
}>()

const { render } = useRender()
const tokenWithType = ref<Record<string, TokenWithType>>({})

onBeforeMount(() => {
  render.useTokenRender(createTokenRenderClass(useTokenType, tokenWithType))
})

function createTokenRenderClass<T extends TokenDesc<string>>(
  useTokenType: string,
  tokenWithType: Ref<Record<string, TokenWithType>>,
) {
  class TokenRenderClass extends TokenBaseRender<T> {
    static TokenType = useTokenType

    constructor(token: T, type: string) {
      super(token, type)

      this.renderWithReact()
    }

    private renderWithReact() {
      this.dom.innerText = ''
      tokenWithType.value[this.token.id] = {
        token: this.token,
        type: this.type,
        root: this.dom,
      }
    }

    updateTypeAndError(type: string) {
      if (type === this.type) return

      super.updateTypeAndError(type)

      tokenWithType.value[this.token.id] = {
        token: this.token,
        type: this.type,
        root: this.dom,
      }
    }

    remove() {
      delete tokenWithType.value[this.token.id]

      this.dom.remove()
    }
  }

  return TokenRenderClass
}
</script>

<template>
  <Teleport v-for="(item, id) in tokenWithType" :key="id" :to="item.root">
    <renderComponent :token="item.token" :type="item.type" />
  </Teleport>
</template>
