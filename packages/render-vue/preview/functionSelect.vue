<script setup lang="ts">
import { computed } from 'vue'

import type { WithLabelFunction } from '@shuttle-formula/functions'
import type { FunctionSelectProps } from '../src'

const props = defineProps<FunctionSelectProps>()

interface SelectOptionType {
  value: string
  label?: string
}

interface SelectGroup {
  id: string
  label: string
  options: SelectOptionType[]
}

function filterFunctionsToSelect(
  functionName: string,
  functions?: Record<string, WithLabelFunction>,
) {
  const options: SelectOptionType[] = []

  for (const key in functions) {
    if (
      key.includes(functionName) ||
      functions[key].label?.includes(functionName)
    ) {
      options.push({
        value: key,
        label: functions[key].label ? `${key}(${functions[key].label})` : key,
      })
    }
  }

  return options
}

const options = computed(() => {
  if (props.functions instanceof Array) {
    const group: SelectGroup[] = []

    props.functions.forEach((item) => {
      const inGroupFunctions = filterFunctionsToSelect(
        props.option.name,
        item.functions,
      )
      if (inGroupFunctions.length > 0) {
        group.push({
          id: item.id,
          label: item.label,
          options: inGroupFunctions,
        })
      }
    })

    return group
  }

  return filterFunctionsToSelect(
    props.option.name,
    props.functions,
  ) as any as SelectGroup[]
})
</script>

<template>
  <span v-if="options.length === 0">未匹配到函数</span>
  <div v-for="group in options" :key="group.id">
    <span>{{ group.label }}</span>
    <div
      v-for="item in group.options"
      :key="item.value"
      @click="() => props.onSelect?.(item.value)"
    >
      {{ item.label || item.value }}
    </div>
  </div>
</template>
