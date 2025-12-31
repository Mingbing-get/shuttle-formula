<template>
  <span v-if="treeNodes.length === 0">未匹配到变量</span>
  <CascaderPanel
    v-else
    wrapperStyle="max-height: 50vh; overflow-y: scroll;"
    :openPath="openPath"
    :selectPath="variablePath"
    :class="class"
    :openOnSelectPath="openOnSelectPath"
    :options="treeNodes"
    :loadMore="loadData"
    @select="handleChecked"
    @open="onOpen"
  />
</template>

<script lang="ts">
export interface VariablePickerPanelProps {
  class?: string
  variables?: Record<string, WithDynamicVariable>
  variablePath?: string[]
  openPath?: string[]
  showAll?: boolean
  canSelectMinLevel?: number
  canDynamicMaxLevel?: number
  openOnSelectPath?: boolean
  getDynamicObjectByPath?: GetDynamicObjectByPath
}
</script>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import type {
  WithDynamicVariable,
  WithDynamicVariableObject,
  GetDynamicObjectByPath,
} from '@shuttle-formula/render'

import CascaderPanel, { CascaderOption } from './cascaderPanel/index.vue'

type VariableNode = CascaderOption<{
  path: string[]
  variable: WithDynamicVariable
}>

const props = defineProps<VariablePickerPanelProps>()
const {
  variables,
  variablePath,
  openPath,
  showAll,
  canSelectMinLevel,
  canDynamicMaxLevel,
  getDynamicObjectByPath,
} = toRefs(props)
const emit = defineEmits<{
  (
    e: 'select',
    path: string[],
    variable: WithDynamicVariable,
    variablePath: WithDynamicVariable[],
  ): void
  (e: 'open', path: string[]): void
}>()
const treeNodes = ref<VariableNode[]>([])

watch(
  [
    variables,
    variablePath,
    openPath,
    showAll,
    canSelectMinLevel,
    canDynamicMaxLevel,
    getDynamicObjectByPath,
  ],
  () => {
    variableToTreeNode({
      variables: variables.value || {},
      path: showAll.value ? [] : variablePath.value || openPath.value || [],
      parentPath: [],
      getDynamicObjectByPath: getDynamicObjectByPath.value,
      canSelectMinLevel: canSelectMinLevel.value,
      canDynamicMaxLevel: canDynamicMaxLevel.value,
    }).then((_treeNodes) => {
      treeNodes.value = _treeNodes
    })
  },
  { immediate: true },
)

const loadData = async (option: VariableNode) => {
  if (!isWithDynamicObject(option.variable)) return

  const subVar = await getDynamicObjectByPath.value?.(
    option.path,
    option.variable,
  )
  if (!subVar) return

  const children = await variableToTreeNode({
    variables: subVar.prototype,
    path: [],
    parentPath: option.path,
    getDynamicObjectByPath: getDynamicObjectByPath.value,
    canSelectMinLevel: canSelectMinLevel.value,
    canDynamicMaxLevel: canDynamicMaxLevel.value,
  })
  option.children = children
}

const handleChecked = (originPath: string[], option: VariableNode) => {
  const variablePath: WithDynamicVariable[] = []
  let currentNodes = treeNodes.value
  for (const item of originPath) {
    const node = currentNodes.find((node) => node.key === item)
    if (!node) return

    variablePath.push(node.variable)
    currentNodes = node.children || []
  }
  console.log(option, variablePath)

  emit('select', option.path, option.variable, variablePath)
}

interface VariableToTreeNodeOptions {
  variables: Record<string, WithDynamicVariable>
  path: string[]
  parentPath: string[]
  getDynamicObjectByPath?: GetDynamicObjectByPath
  canSelectMinLevel?: number
  canDynamicMaxLevel?: number
}

async function variableToTreeNode({
  variables,
  path,
  parentPath,
  getDynamicObjectByPath,
  canSelectMinLevel,
  canDynamicMaxLevel,
}: VariableToTreeNodeOptions) {
  const nodes: VariableNode[] = []

  const pathKey = path[0] || ''
  const pathIsKey: boolean = !!variables[pathKey]

  for (const key in variables) {
    let currentVariable = variables[key]
    if (!pathIsKey && !currentVariable.label?.includes(pathKey)) continue

    const currentPath = [...parentPath, key]
    if (
      getDynamicObjectByPath &&
      path.length > 0 &&
      isWithDynamicObject(currentVariable)
    ) {
      const newVariable = await getDynamicObjectByPath(
        currentPath,
        currentVariable,
      )
      if (newVariable) {
        currentVariable = newVariable
      }
    }

    if (
      currentVariable.type !== 'object' ||
      isWithDynamicObject(currentVariable)
    ) {
      nodes.push({
        key,
        title: currentVariable.label ?? key,
        path: currentPath,
        isDisabled: canSelectMinLevel
          ? currentPath.length < canSelectMinLevel
          : false,
        variable: currentVariable,
        isLeaf:
          currentVariable.type !== 'object' ||
          (!!canDynamicMaxLevel && currentPath.length > canDynamicMaxLevel),
      })
      continue
    }

    const children = await variableToTreeNode({
      variables: currentVariable.prototype,
      path: key === pathKey ? path.slice(1) : [],
      parentPath: currentPath,
      getDynamicObjectByPath,
      canSelectMinLevel,
      canDynamicMaxLevel,
    })
    if (children.length > 0) {
      nodes.push({
        key,
        title: currentVariable.label ?? key,
        path: currentPath,
        isDisabled: canSelectMinLevel
          ? currentPath.length < canSelectMinLevel
          : false,
        variable: currentVariable,
        children,
      })
    }
  }

  return nodes
}

function isWithDynamicObject(
  variable: WithDynamicVariable,
): variable is WithDynamicVariableObject {
  return (
    variable.type === 'object' &&
    !(variable as any).prototype &&
    (variable as any).dynamic
  )
}
</script>
