import { useCallback, useEffect, useState, useTransition } from 'react'
import { Tree, TreeNode, TreeValue } from 'wonderful-marrow/rabbit'

import {
  WithDynamicVariable,
  WithDynamicVariableObject,
  VariableTipOption,
  GetDynamicObjectByPath,
} from 'render'

export interface VariableSelectProps {
  variables?: Record<string, WithDynamicVariable>
  getDynamicObjectByPath?: GetDynamicObjectByPath
  option: VariableTipOption
  onSelect?: (path: string[]) => void
}

type VariableNode = TreeNode<{
  path: string[]
  variable: WithDynamicVariable
}>

export default function VariableSelect({
  option,
  variables,
  getDynamicObjectByPath,
  onSelect,
}: VariableSelectProps) {
  const [_, startTransition] = useTransition()
  const [expandPath, setExpandPath] = useState<TreeValue[][]>([])
  const [treeNodes, setTreeNodes] = useState<VariableNode[]>([])

  useEffect(() => {
    if (!variables) return

    setTreeNodes(variableToTreeNode(variables, option.path, []))
  }, [variables, option.path])

  useEffect(() => {
    startTransition(() => {
      setExpandPath(getAllTreePath(treeNodes))
    })
  }, [treeNodes])

  const loadData = useCallback(
    async (node: VariableNode) => {
      if (!isWithDynamicObject(node.variable)) return

      const subVar = await getDynamicObjectByPath?.(node.path, node.variable)
      if (!subVar) return

      node.variable.prototype = subVar.prototype
      const children = variableToTreeNode(subVar.prototype, [], node.path)
      node.children = children

      setTreeNodes((old) => [...old])
    },
    [getDynamicObjectByPath],
  )

  const handleChecked = useCallback(
    (_: any, node: VariableNode) => {
      onSelect?.(node.path)
    },
    [onSelect],
  )

  if (treeNodes.length === 0) {
    return <span>未匹配到变量</span>
  }

  return (
    <Tree
      expandPath={expandPath}
      data={treeNodes}
      loadData={loadData}
      onChecked={handleChecked}
    />
  )
}

function variableToTreeNode(
  variables: Record<string, WithDynamicVariable>,
  path: string[],
  parentPath: string[],
) {
  const nodes: VariableNode[] = []

  const pathKey = path[0] || ''
  for (const key in variables) {
    const currentVariable = variables[key]
    if (!key.includes(pathKey) && !currentVariable.label?.includes(pathKey))
      continue

    const currentPath = [...parentPath, key]
    const value = currentPath.join('-')
    if (
      currentVariable.type !== 'object' ||
      isWithDynamicObject(currentVariable)
    ) {
      if (path.length <= 1) {
        nodes.push({
          value,
          label: currentVariable.label
            ? `${key}(${currentVariable.label})`
            : key,
          path: currentPath,
          variable: currentVariable,
          isLeft: currentVariable.type !== 'object',
        })
      }
      continue
    }

    const children = variableToTreeNode(
      currentVariable.prototype,
      path.slice(1),
      currentPath,
    )
    if (children.length > 0) {
      nodes.push({
        value,
        label: currentVariable.label ? `${key}(${currentVariable.label})` : key,
        path: currentPath,
        variable: currentVariable,
        children,
      })
    }
  }

  return nodes
}

function getAllTreePath(
  treeNodes: VariableNode[],
  parentPath: TreeValue[] = [],
) {
  const paths: TreeValue[][] = []

  treeNodes.forEach((node) => {
    const currentPath = [...parentPath, node.value]
    if (node.children) {
      paths.push(currentPath, ...getAllTreePath(node.children, currentPath))
    }
  })

  return paths
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
