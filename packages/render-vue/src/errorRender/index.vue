<script setup lang="ts">
import { onBeforeMount, ref, Ref } from 'vue'
import { SyntaxError, generateId } from 'core'
import { ErrorDisplay } from 'render'

import useRender from '../context/useRender'
import { WithRootError, ErrorRenderComponent } from './type'

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
    private root: HTMLDivElement
    private id: string

    constructor(error?: SyntaxError.Desc) {
      this.id = generateId()
      this.root = document.createElement('div')

      withRootErrors.value[this.id] = {
        root: this.root,
        error: error,
      }
    }

    updateError(error?: SyntaxError.Desc) {
      withRootErrors.value[this.id] = {
        root: this.root,
        error: error,
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
