<template>
  <div class="function-description-example">
    <Tip v-if="tip" :detail="tip" />
    <div class="function-example-use">
      <span class="function-name">@{{ props.name }}</span>
      <span>(</span>
      <span v-for="(item, index) in props.params" :key="index">
        <span class="function-params">{{ item }}</span>
        <span v-if="index !== props.params.length - 1">,&nbsp;</span>
      </span>
      <span>)</span>
    </div>
    <div class="function-example-result">
      <span>返回值: </span>
      <span class="function-result">{{ props.result }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FunctionDescriptionExample } from '@shuttle-formula/functions'
import Tip from './tip.vue'

export interface FunctionDescriptionExampleProps extends FunctionDescriptionExample {
  name: string
}

const props = defineProps<FunctionDescriptionExampleProps>()
</script>
