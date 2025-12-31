<template>
  <div class="formula-function-wrapper">
    <SelectPanel
      :options="optionGroups"
      @hoverChange="handleChangeHover"
      @clickItem="handleClick"
    />
    <div v-if="hoverFunction?.description" class="formula-function-example">
      <FunctionDescriptionRender
        v-bind="hoverFunction.description"
        :name="hoverFunction.label || ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  WithLabelFunction,
  FunctionDescription,
  FunctionGroup,
} from '@shuttle-formula/functions'

import FunctionDescriptionRender from '../../functionSelect/description/index.vue'
import SelectPanel from '../../functionSelect/selectPanel/index.vue'
import {
  SelectGroup,
  SelectOption,
} from '../../functionSelect/selectPanel/type'

interface Props {
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (
    e: 'pickFunction',
    fnKey: string,
    fn: WithLabelFunction<FunctionDescription>,
  ): void
}>()
const hoverFunction = ref<WithLabelFunction<FunctionDescription>>()

const optionGroups = computed(() => {
  if (!props.functions) return []

  if (Array.isArray(props.functions)) {
    const optionGroups: SelectGroup[] = props.functions.map((group) => {
      return {
        id: group.id,
        label: group.label,
        options: recordsToOptions(group.functions),
      }
    })

    return optionGroups
  }

  return recordsToOptions(props.functions)
})

const findFunction = (functionKey: string) => {
  if (!props.functions) return

  if (Array.isArray(props.functions)) {
    for (const group of props.functions) {
      if (group.functions[functionKey]) {
        return group.functions[functionKey]
      }
    }
  } else {
    return props.functions[functionKey]
  }
}

const handleChangeHover = (value?: string) => {
  if (!value) {
    hoverFunction.value = undefined
    return
  }

  const func = findFunction(value)
  hoverFunction.value = func
}

const handleClick = (option: SelectOption) => {
  const func = findFunction(option.value)
  if (func) {
    emit('pickFunction', option.value, func)
  }
}

function recordsToOptions(
  functionMap: Record<string, WithLabelFunction<FunctionDescription>>,
) {
  const options: SelectOption[] = []

  for (const key in functionMap) {
    options.push({
      value: key,
      label: functionMap[key].label || '',
    })
  }

  return options
}
</script>
