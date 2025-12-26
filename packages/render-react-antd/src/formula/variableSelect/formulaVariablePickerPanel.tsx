import { useCallback, useEffect, useState } from 'react'
import type {
  WithDynamicVariable,
  WithDynamicVariableObject,
  GetDynamicObjectByPath,
} from 'render'

import CascaderPanel, { CascaderOption } from './cascaderPanel'

export interface VariablePickerPanelProps {
  className?: string
  variables?: Record<string, WithDynamicVariable>
  variablePath?: string[]
  openPath?: string[]
  showAll?: boolean
  canSelectMinLevel?: number
  canDynamicMaxLevel?: number
  openOnSelectPath?: boolean
  getDynamicObjectByPath?: GetDynamicObjectByPath
  onSelect?: (
    path: string[],
    variable: WithDynamicVariable,
    variablePath: WithDynamicVariable[],
  ) => void
  onOpen?: (path: string[]) => void
}

type VariableNode = CascaderOption<{
  path: string[]
  variable: WithDynamicVariable
}>

export default function FormulaVariablePickerPanel({
  className,
  variablePath,
  openPath,
  variables,
  showAll,
  canSelectMinLevel,
  canDynamicMaxLevel,
  openOnSelectPath = true,
  getDynamicObjectByPath,
  onSelect,
  onOpen,
}: VariablePickerPanelProps) {
  const [treeNodes, setTreeNodes] = useState<VariableNode[]>([])

  useEffect(() => {
    if (!variables) return

    variableToTreeNode({
      variables,
      path: showAll ? [] : variablePath || openPath || [],
      parentPath: [],
      getDynamicObjectByPath,
      canSelectMinLevel,
      canDynamicMaxLevel,
    }).then((treeNodes) => {
      setTreeNodes(treeNodes)
    })
  }, [
    variables,
    variablePath,
    openPath,
    showAll,
    canSelectMinLevel,
    canDynamicMaxLevel,
    getDynamicObjectByPath,
  ])

  const loadData = useCallback(
    async (option: VariableNode) => {
      if (!isWithDynamicObject(option.variable)) return

      const subVar = await getDynamicObjectByPath?.(
        option.path,
        option.variable,
      )
      if (!subVar) return

      const children = await variableToTreeNode({
        variables: subVar.prototype,
        path: [],
        parentPath: option.path,
        getDynamicObjectByPath,
        canSelectMinLevel,
        canDynamicMaxLevel,
      })
      option.children = children

      setTreeNodes((old) => [...old])
    },
    [getDynamicObjectByPath, canSelectMinLevel, canDynamicMaxLevel],
  )

  const handleChecked = useCallback(
    (originPath: string[], option: VariableNode) => {
      const variablePath: WithDynamicVariable[] = []
      let currentNodes = treeNodes
      for (const item of originPath) {
        const node = currentNodes.find((node) => node.key === item)
        if (!node) return

        variablePath.push(node.variable)
        currentNodes = node.children || []
      }

      onSelect?.(option.path, option.variable, variablePath)
    },
    [onSelect, treeNodes],
  )

  if (treeNodes.length === 0) {
    return <span>未匹配到变量</span>
  }

  return (
    <CascaderPanel
      openPath={openPath}
      selectPath={variablePath}
      className={className}
      wrapperStyle={{ maxHeight: '50vh', overflowY: 'scroll' }}
      openOnSelectPath={openOnSelectPath}
      options={treeNodes}
      onSelect={handleChecked}
      loadMore={loadData}
      onOpen={onOpen}
    />
  )
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
