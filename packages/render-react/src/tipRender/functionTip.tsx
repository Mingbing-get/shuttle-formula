import { useMemo, useRef, useState, memo } from 'react'
import { createPortal } from 'react-dom'
import { FunctionTipOption } from 'render'

import _FunctionSelect, { FunctionSelectProps } from './functionSelect'

import { useRender } from '../context'

export type FunctionSelectComponent = (
  props: FunctionSelectProps,
) => JSX.Element
export type { FunctionSelectProps }

interface Props {
  FunctionSelect?: FunctionSelectComponent
}

function FunctionTip({ FunctionSelect = _FunctionSelect }: Props) {
  const { render } = useRender()
  const [tipOption, updateTipOption] = useState<FunctionTipOption>()
  const handleSelect = useRef<(functionName: string) => void>(() => {})

  const wrapper = useMemo(() => {
    const wrapper = document.createElement('div')

    render.tipRender.setFunctionPicker({
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
    <FunctionSelect
      option={tipOption}
      functions={render.getOption().functions}
      onSelect={handleSelect.current}
    />,
    wrapper,
  )
}

export default memo(FunctionTip)
