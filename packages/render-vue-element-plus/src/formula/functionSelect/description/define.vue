<template>
  <div class="function-description-define">
    <span class="function-name">@{{ props.name }}</span>
    <span>(</span>
    <span v-for="(item, index) in props.paramsList" :key="index">
      <span class="function-params">{{ item }}</span>
      <span v-if="index !== props.paramsList.length - 1">,&nbsp;</span>
    </span>
    <span>)</span>
    <span>&nbsp;&nbsp;-&gt;&nbsp;&nbsp;</span>
    <span class="function-result">{{ props.result }}</span>
  </div>
</template>
<script setup lang="ts">
import { FunctionDescriptionDefine } from '@shuttle-formula/functions'

export interface FunctionDescriptionDefineProps extends FunctionDescriptionDefine {
  name: string
}

const props = defineProps<FunctionDescriptionDefineProps>()
</script>
