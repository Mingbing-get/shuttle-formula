<template>
  <div class="function-description">
    <Define v-bind="props.define" :name="props.name" />
    <Tip :detail="props.detail" />
    <div class="function-description-line" />
    <Example
      v-for="(example, index) in props.examples"
      v-bind="example"
      :key="index"
      :name="props.name"
    />
  </div>
</template>

<script setup lang="ts">
import {
  FunctionDescriptionDefine,
  FunctionDescriptionExample,
} from '@shuttle-formula/functions'
import Define from './define.vue'
import Tip from './tip.vue'
import Example from './exapmle.vue'

interface Props {
  name: string
  define: FunctionDescriptionDefine
  detail: string
  examples: FunctionDescriptionExample[]
}

const props = defineProps<Props>()
</script>

<style lang="scss">
.function-description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 60vw;
  .function-description-define {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .function-name {
    color: gold;
    word-break: keep-all;
    white-space: nowrap;
  }
  .function-params {
    color: #db6c11b0;
    word-break: keep-all;
    white-space: nowrap;
  }
  .function-result {
    color: green;
  }

  .function-description-tip {
    font-size: 0.75rem;
  }
  .function-description-line {
    width: 100%;
    height: 0;
    border-top: 1px dashed var(--color-border-2);
    margin: 4px 0;
  }
  .function-description-example {
    display: flex;
    flex-direction: column;
    .function-example-use,
    .function-example-result {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-left: 1rem;

      .function-result {
        margin-left: 6px;
      }
    }
  }
}
</style>
