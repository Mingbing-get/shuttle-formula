<template>
  <div
    :class="['cascader-panel-wrapper', props.wrapperClassName]"
    :style="props.wrapperStyle"
  >
    <div
      v-for="option in props.options"
      :class="{
        'cascader-panel-item': true,
        'is-selected': selectPath?.[0] === option.key,
        'is-open': openNextOption?.key === option.key,
        'is-disabled': option.isDisabled,
      }"
      :key="option.key"
    >
      <div
        class="cascader-panel-title"
        @click="() => handleSelect([option.key], option)"
      >
        {{ option.title }}
      </div>
      <LoadingOutlined
        v-if="loadingMap[option.key]"
        class="cascader-panel-loading-icon"
      />
      <RightOutlined
        v-else-if="option.children?.length || (loadMore && !option.isLeaf)"
        class="cascader-panel-next-icon"
        @click="
          () =>
            handleOpenNext(
              openNextOption?.key === option.key ? [] : [option.key],
              option,
            )
        "
      />
    </div>
  </div>
  <CascaderSinglePanel
    v-if="openNextOption?.children"
    :wrapperClassName="wrapperClassName"
    :wrapperStyle="wrapperStyle"
    :options="openNextOption.children"
    :selectPath="nextSelectPath"
    :openPath="nextOpenPath"
    @select="
      (path, option) =>
        handleSelect([openNextOption?.key || '', ...path], option)
    "
    @open="
      (path, option) =>
        handleOpenNext([openNextOption?.key || '', ...path], option)
    "
    :loadMore="props.loadMore"
  />
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import { CascaderPanelProps, CascaderOption } from './index.vue'
import RightOutlined from '../../../components/rightOutlined.vue'
import LoadingOutlined from '../../../components/loadingOutlined.vue'

defineOptions({
  name: 'CascaderSinglePanel',
})

const props =
  defineProps<
    Omit<CascaderPanelProps<T>, 'style' | 'class' | 'openOnSelectPath'>
  >()

const emit = defineEmits<{
  (e: 'open', path: string[], option?: CascaderOption<T>): void
  (e: 'select', path: string[], option: CascaderOption<T>): void
}>()

const openNextOption = ref<CascaderOption<T>>()
const loadingMap = ref<Record<string, boolean>>({})

const handleLoadMore = async (option: CascaderOption<T>) => {
  if (!props.loadMore) return

  loadingMap.value = {
    ...loadingMap.value,
    [option.key]: true,
  }

  await props.loadMore(option)

  loadingMap.value = {
    ...loadingMap.value,
    [option.key]: false,
  }
}

const handleOpenNext = (path: string[], option?: CascaderOption<T>) => {
  if (!path.length) return

  if (option && !option.isLeaf && !option.children?.length) {
    handleLoadMore(option)
  }

  emit('open', path, option)
}

const handleSelect = (path: string[], option: CascaderOption<T>) => {
  if (option.isDisabled) return

  emit('select', path, option)
}

const nextSelectPath = computed(() => {
  if (!openNextOption.value || !props.selectPath?.length) return []

  if (openNextOption.value.key !== props.selectPath[0]) return []

  return props.selectPath.slice(1)
})

const nextOpenPath = computed(() => {
  if (!openNextOption.value || !props.openPath?.length) return []

  if (openNextOption.value.key !== props.openPath[0]) return []

  return [...props.openPath].slice(1)
})

watch(
  [() => props.options, () => props.openPath, loadingMap],
  () => {
    if (!props.openPath?.length) {
      openNextOption.value = undefined
      return
    }

    const openOption = props.options.find(
      (option) => option.key === props.openPath?.[0],
    )

    if (openOption?.children?.length) {
      openNextOption.value = openOption
    } else {
      openNextOption.value = undefined
    }
  },
  { immediate: true },
)
</script>
