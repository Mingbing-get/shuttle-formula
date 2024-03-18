import { useCallback, useMemo } from 'react'
import {
  SelectPanel,
  SelectOptionType,
  SelectGroup,
} from 'wonderful-marrow/rabbit'

import { WithLabelFunction, FunctionGroup, FunctionTipOption } from 'render'

export interface FunctionSelectProps {
  functions?: Record<string, WithLabelFunction> | FunctionGroup[]
  option: FunctionTipOption
  onSelect?: (functionName: string) => void
}

export default function FunctionSelect({
  option,
  functions,
  onSelect,
}: FunctionSelectProps) {
  const options = useMemo(() => {
    if (functions instanceof Array) {
      const group: SelectGroup<string>[] = []

      functions.forEach((item) => {
        const inGroupFunctions = filterFunctionsToSelect(
          option.name,
          item.functions,
        )
        if (inGroupFunctions.length > 0) {
          group.push({
            id: item.id,
            label: item.id,
            options: inGroupFunctions,
          })
        }
      })

      return group
    }

    return filterFunctionsToSelect(option.name, functions)
  }, [functions, option.name])

  const handleClickItem = useCallback(
    (option: SelectOptionType<string>) => {
      onSelect?.(option.value)
    },
    [onSelect],
  )

  if (options.length === 0) {
    return <span>未匹配到函数</span>
  }

  return <SelectPanel options={options} onClickItem={handleClickItem} />
}

function filterFunctionsToSelect(
  functionName: string,
  functions?: Record<string, WithLabelFunction>,
) {
  const options: SelectOptionType<string>[] = []

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
