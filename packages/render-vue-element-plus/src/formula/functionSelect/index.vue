<template>
  <span v-if="options.length === 0">未匹配到函数</span>
  <SelectPanel v-else :options="options" @click-item="handleClickItem" />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type {
  WithLabelFunction,
  FunctionDescription,
  FunctionGroup,
} from '@shuttle-formula/functions'
import type { FunctionTipOption } from '@shuttle-formula/render'

import { SelectGroup, SelectOption } from './selectPanel/type'
import SelectPanel from './selectPanel/index.vue'
import FunctionDescriptionRender from './description/index.vue'

export interface FunctionSelectProps {
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
  option: FunctionTipOption
}

const props = defineProps<FunctionSelectProps>()
const emit = defineEmits<{
  (e: 'select', functionName: string): void
}>()

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

  return filterFunctionsToSelect(props.option.name, props.functions)
})

const handleClickItem = (option: SelectOption) => {
  console.log(option)
  emit('select', option.value)
}

function filterFunctionsToSelect(
  functionName: string,
  functions?: Record<string, WithLabelFunction<FunctionDescription>>,
) {
  const options: SelectOption[] = []

  for (const key in functions) {
    if (
      key.includes(functionName) ||
      functions[key].label?.includes(functionName)
    ) {
      options.push({
        value: key,
        label: functions[key].label ?? key,
        extraTip: functions[key].description
          ? h(FunctionDescriptionRender, {
              ...functions[key].description,
              name: functions[key].label || '',
            })
          : undefined,
      })
    }
  }

  return options
}
</script>
