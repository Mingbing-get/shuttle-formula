import { useCallback, useMemo, useState } from 'react'
import { WithLabelFunction } from 'render'

import SelectPanel from '../../functionSelect/selectPanel'
import {
  SelectGroup,
  SelectOption,
} from '../../functionSelect/selectPanel/type'

import { functionWithGroups } from '../../functionDefine'

interface Props {
  onPickFunction?: (
    fnKey: string,
    fn: WithLabelFunction<React.ReactNode>,
  ) => void
}

export default function FormulaFunction({ onPickFunction }: Props) {
  const [hoverFunction, setHoverFunction] =
    useState<WithLabelFunction<React.ReactNode>>()

  const optionGroups = useMemo(() => {
    const optionGroups: SelectGroup[] = functionWithGroups.map((group) => {
      const options: SelectOption[] = []

      for (const key in group.functions) {
        options.push({
          value: key,
          label: group.functions[key].label || '',
        })
      }

      return {
        id: group.id,
        label: group.label,
        options,
      }
    })

    return optionGroups
  }, [])

  const handleChangeHover = useCallback((value?: string) => {
    if (!value) {
      setHoverFunction(undefined)
      return
    }

    for (const group of functionWithGroups) {
      if (group.functions[value]) {
        setHoverFunction(group.functions[value])
        return
      }
    }

    setHoverFunction(undefined)
  }, [])

  const handleClick = useCallback(
    (option: SelectOption) => {
      for (const group of functionWithGroups) {
        if (group.functions[option.value]) {
          onPickFunction?.(option.value, group.functions[option.value])
          return
        }
      }
    },
    [onPickFunction],
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
          {hoverFunction.description}
        </div>
      )}
    </div>
  )
}
