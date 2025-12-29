import { useCallback, useMemo, useState } from 'react'
import {
  WithLabelFunction,
  FunctionDescription,
  FunctionGroup,
} from '@shuttle-formula/functions'

import FunctionDescriptionRender from '../../functionSelect/description'
import SelectPanel from '../../functionSelect/selectPanel'
import {
  SelectGroup,
  SelectOption,
} from '../../functionSelect/selectPanel/type'

interface Props {
  functions?:
    | Record<string, WithLabelFunction<FunctionDescription>>
    | FunctionGroup<FunctionDescription>[]
  onPickFunction?: (
    fnKey: string,
    fn: WithLabelFunction<FunctionDescription>,
  ) => void
}

export default function FormulaFunction({ functions, onPickFunction }: Props) {
  const [hoverFunction, setHoverFunction] =
    useState<WithLabelFunction<FunctionDescription>>()

  const optionGroups = useMemo(() => {
    if (!functions) return []

    if (Array.isArray(functions)) {
      const optionGroups: SelectGroup[] = functions.map((group) => {
        return {
          id: group.id,
          label: group.label,
          options: recordsToOptions(group.functions),
        }
      })

      return optionGroups
    }

    return recordsToOptions(functions)
  }, [functions])

  const findFunction = useCallback(
    (functionKey: string) => {
      if (!functions) return

      if (Array.isArray(functions)) {
        for (const group of functions) {
          if (group.functions[functionKey]) {
            return group.functions[functionKey]
          }
        }
      } else {
        return functions[functionKey]
      }
    },
    [functions],
  )

  const handleChangeHover = useCallback(
    (value?: string) => {
      if (!value) {
        setHoverFunction(undefined)
        return
      }

      const func = findFunction(value)

      setHoverFunction(func)
    },
    [findFunction],
  )

  const handleClick = useCallback(
    (option: SelectOption) => {
      const func = findFunction(option.value)
      if (func) {
        onPickFunction?.(option.value, func)
      }
    },
    [onPickFunction, findFunction],
  )

  return (
    <div className="formula-function-wrapper">
      <SelectPanel
        options={optionGroups}
        onHoverChange={handleChangeHover}
        onClickItem={handleClick}
      />
      {hoverFunction?.description && (
        <div className="formula-function-example">
          <FunctionDescriptionRender
            {...hoverFunction.description}
            name={hoverFunction.label || ''}
          />
        </div>
      )}
    </div>
  )
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
