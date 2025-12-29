import { useCallback, useEffect, useRef } from 'react'
import { Tabs } from 'antd'
import { ChangeCursorListener } from '@shuttle-formula/render/src/codeManager/cursor'
import { useRender } from '@shuttle-formula/render-react'
import { WithLabelFunction } from '@shuttle-formula/functions'

import Operator from './operator'
import FormulaFunction from './function'
import FormulaVariable from './variable'

import './index.scss'

interface Props {
  style?: React.CSSProperties
}

export default function ViewPanel({ style }: Props) {
  const { render } = useRender()
  const cursorIndexRef = useRef(0)

  useEffect(() => {
    const changeListener: ChangeCursorListener = (event) => {
      if (event.cursorIndex === -1) return

      cursorIndexRef.current = event.cursorIndex
    }

    render.codeManager.cursor.addListener(changeListener)

    return () => {
      render.codeManager.cursor.removeListener(changeListener)
    }
  }, [])

  const handlePickOperator = useCallback((token: string) => {
    render.codeManager.spliceCode(
      cursorIndexRef.current,
      0,
      token,
      true,
      cursorIndexRef.current + token.length,
    )
  }, [])

  const handlePickFunction = useCallback(
    (fnKey: string, fn: WithLabelFunction) => {
      const code = `@${fnKey}()`
      render.codeManager.spliceCode(
        cursorIndexRef.current,
        0,
        code,
        true,
        cursorIndexRef.current + code.length - 1,
      )
    },
    [],
  )

  const handleSelectVariable = useCallback(async (path: string[]) => {
    const code = `$${path.join('.')}`
    render.codeManager.spliceCode(
      cursorIndexRef.current,
      0,
      code,
      true,
      cursorIndexRef.current + code.length,
    )
  }, [])

  return (
    <Tabs
      size="small"
      className="formula-view-panel-tab"
      style={style}
      items={[
        {
          label: '变量',
          key: 'variable',
          children: (
            <FormulaVariable
              variables={render.getOption().variables}
              getDynamicObjectByPath={render.getOption().getDynamicObjectByPath}
              onSelect={handleSelectVariable}
            />
          ),
        },
        {
          label: '函数',
          key: 'function',
          children: <FormulaFunction onPickFunction={handlePickFunction} />,
        },
        {
          label: '运算符',
          key: 'operator',
          children: <Operator onPickOperator={handlePickOperator} />,
        },
      ]}
    />
  )
}
