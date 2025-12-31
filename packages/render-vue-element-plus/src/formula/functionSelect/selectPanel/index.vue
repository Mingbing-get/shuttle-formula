<template>
  <div
    :class="`function-select-wrapper ${props.wrapperClassName}`"
    :style="props.wrapperStyle"
  >
    <template
      v-for="item in options"
      :key="isSelectGroup(item) ? item.id : item.value"
    >
      <Group v-if="isSelectGroup(item)" :key="item.id">
        <template #title>
          <span>{{ item.label }}</span>
        </template>
        <Option
          v-for="subItem in item.options"
          :class="{
            'is-select': value === subItem.value,
            'is-hover': hoverValue === subItem.value,
          }"
          v-bind="subItem"
          :key="subItem.value"
          @click="(value) => emit('clickItem', subItem)"
          @mouseenter="hoverValue = subItem.value"
        />
      </Group>
      <Option
        v-else
        :class="{
          'is-select': value === item.value,
          'is-hover': hoverValue === item.value,
        }"
        v-bind="item"
        :key="item.value"
        @click="(value) => emit('clickItem', item)"
        @mouseenter="hoverValue = item.value"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { SelectOption, SelectGroup } from './type'
import Option from './option.vue'
import Group from './group.vue'
import {
  isSelectGroup,
  findOptionInGroupsOrOptions,
  findNextOptionInGroupsOrOptions,
} from './utils'

interface Props {
  wrapperClassName?: string
  wrapperStyle?: string
  value?: string
  options: SelectOption[] | SelectGroup[]
}

const emit = defineEmits<{
  (e: 'clickItem', option: SelectOption): void
  (e: 'hoverChange', value?: string): void
}>()

const props = defineProps<Props>()
const hoverValue = ref(props.value)

onMounted(() => {
  document.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keyDown)
})

watch(hoverValue, () => {
  emit('hoverChange', hoverValue.value)
})

const changeHover = (step: number) => {
  const nextOption = findNextOptionInGroupsOrOptions(
    props.options,
    step,
    hoverValue.value,
  )
  if (!nextOption) return

  hoverValue.value = nextOption.value
}

const handleSelect = () => {
  if (!hoverValue.value) return

  const item = findOptionInGroupsOrOptions(props.options, hoverValue.value)

  if (!item) return

  emit('clickItem', item)
}

function keyDown(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return

  if (e.key === 'ArrowDown') {
    changeHover(1)
  } else if (e.key === 'ArrowUp') {
    changeHover(-1)
  } else if (e.key === 'Enter') {
    handleSelect()
  }

  e.stopPropagation()
  e.preventDefault()
  return false
}
</script>

<style lang="scss">
.function-select-wrapper {
  min-width: 6rem;
  max-height: 12rem;
  overflow-y: auto;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
}

.function-select-option {
  display: flex;
  padding: 0.25rem 0.5rem;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 4px;

  &.is-hover {
    background-color: #e8f3ff;
  }
  &.is-select {
    background-color: #165dff;
    font-weight: 600;
  }
}

.function-select-group {
  display: flex;
  flex-direction: column;
  .function-select-group-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 0.2rem 0;

    .function-select-group-header-icon {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: rotate 0.2s linear;
      font-size: 0.75rem;
      &:hover {
        background-color: #e5e6eb;
      }
    }

    .function-select-group-title {
      font-size: 0.75rem;
      color: #c9cdd4;
    }
  }
  .function-select-group-options {
    .function-select-option,
    .function-multiple-select-option {
      padding-left: 1.5rem;
    }
  }
}
</style>
