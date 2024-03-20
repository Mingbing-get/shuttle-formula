<script setup lang="ts">
import type { Ref } from 'vue'
import type { SyntaxError } from 'core'
import type { ErrorDisplay } from 'render'
import type { WithRootError, ErrorRenderComponent } from './type'

import { onBeforeMount, ref } from 'vue'
import { generateId } from 'core'

import useRender from '../context/useRender'

const { renderComponent } = defineProps<{
  renderComponent: ErrorRenderComponent
}>()

const withRootErrors = ref<Record<string, WithRootError>>({})
const { render } = useRender()

onBeforeMount(() => {
  render.errorRender.setDisplayFactory(createErrorDisplay(withRootErrors))
})

function createErrorDisplay(
  withRootErrors: Ref<Record<string, WithRootError>>,
) {
  class ErrorDisplayClass implements ErrorDisplay {
    private readonly root: HTMLDivElement
    private readonly id: string

    constructor(error?: SyntaxError.Desc) {
      this.id = generateId()
      this.root = document.createElement('div')

      withRootErrors.value[this.id] = {
        root: this.root,
        error,
      }
    }

    updateError(error?: SyntaxError.Desc) {
      withRootErrors.value[this.id] = {
        root: this.root,
        error,
      }
    }

    getRoot() {
      return this.root
    }

    remove() {
      delete withRootErrors.value[this.id]
    }
  }

  return ErrorDisplayClass
}
</script>

<template>
  <Teleport v-for="(item, id) in withRootErrors" :key="id" :to="item.root">
    <renderComponent :error="item.error" />
  </Teleport>
</template>
