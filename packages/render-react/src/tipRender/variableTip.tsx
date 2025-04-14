import { memo, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useRender } from '../context'

import type { VariableSelectProps } from './type'
import type { VariableTipOption } from 'render'

export type VariableSelectComponent = (
  props: VariableSelectProps,
) => JSX.Element
export type { VariableSelectProps }

interface Props {
  VariableSelect: VariableSelectComponent
}

function VariableTip({ VariableSelect }: Props) {
  const { render } = useRender()
  const [tipOption, updateTipOption] = useState<VariableTipOption>()
  const handleSelect = useRef<(path: string[]) => void>(() => {})

  const wrapper = useMemo(() => {
    const wrapper = document.createElement('div')

    render.tipRender.setVariablePicker({
      updateTipOption,
      setOnSelect(onSelect) {
        handleSelect.current = onSelect
      },
      getRoot() {
        return wrapper
      },
    })

    return wrapper
  }, [])

  if (!tipOption) return <></>

  return createPortal(
    <VariableSelect
      option={tipOption}
      variables={render.getOption().variables}
      onSelect={handleSelect.current}
      getDynamicObjectByPath={render.getOption().getDynamicObjectByPath}
    />,
    wrapper,
  )
}

export default memo(VariableTip)
