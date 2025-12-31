<template>
  <div :class="['cascader-panel-container', props.class]" :style="props.style">
    <CascaderSinglePanel
      v-bind="props"
      :openPath="_openPath"
      :selectPath="_selectPath"
      @select="handleSelect"
      @open="handleOpen"
    />
  </div>
</template>

<script lang="ts">
export type CascaderOption<T extends Record<string, any>> = {
  key: string
  title: string
  isLeaf?: boolean
  isDisabled?: boolean
  children?: CascaderOption<T>[]
} & T

export interface CascaderPanelProps<T extends Record<string, any>> {
  style?: string
  class?: string
  wrapperStyle?: string
  wrapperClassName?: string
  options: CascaderOption<T>[]
  selectPath?: string[]
  openPath?: string[]
  openOnSelectPath?: boolean
  loadMore?: (option: CascaderOption<T>) => Promise<void>
}
</script>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, watch } from 'vue'
import CascaderSinglePanel from './panel.vue'

const props = defineProps<CascaderPanelProps<T>>()
const emit = defineEmits<{
  (e: 'open', path: string[], option?: CascaderOption<T>): void
  (e: 'select', path: string[], option: CascaderOption<T>): void
}>()

const _openPath = ref(props.openPath)
const _selectPath = ref(props.selectPath)

const handleOpen = (path: string[], option?: CascaderOption<T>) => {
  _openPath.value = path
  emit('open', path, option)
}

const handleSelect = (path: string[], option: CascaderOption<T>) => {
  _selectPath.value = path
  emit('select', path, option)
}

watch(
  () => props.selectPath,
  (newVal) => {
    if (newVal) {
      handleOpen(newVal)
    }
  },
  { immediate: true },
)
</script>

<style lang="scss">
.cascader-panel-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 60vw;
  overflow-x: auto;
}

.cascader-panel-wrapper {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  width: 140px;
  min-width: 140px;
  &:not(:last-child) {
    border-right: 1px solid #ccc;
  }

  .cascader-panel-item {
    display: flex;
    flex-direction: row;
    padding: 2px 4px;
    margin: 2px 0;
    border-radius: 4px;
    align-items: center;
    cursor: pointer;

    .cascader-panel-title {
      flex: 1;
    }

    &.is-selected {
      color: #1677ff;
    }

    &:hover {
      background-color: #f2f3f5;
    }

    &.is-disabled {
      background-color: #f2f3f5;
      color: #d9d9d9;
      cursor: not-allowed;
    }

    &.is-open {
      background-color: rgb(232, 243, 255);
    }

    .cascader-panel-next-icon {
      border-radius: 50%;
      padding: 2px;
      font-size: 0.75rem;
      cursor: pointer;
      &:hover {
        background-color: #fff;
      }
    }

    .cascader-panel-loading-icon {
      color: #165dff;
    }
  }
}
</style>
