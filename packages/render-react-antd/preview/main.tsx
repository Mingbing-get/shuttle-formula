import { useCallback, useRef } from 'react'
import { Button } from 'antd'

import { FormulaRender, computedFormula } from '../src'
import { mockVariablesDefine, mockVariablesValue } from './mock'

export default function Main() {
  const codeRef = useRef('')

  const handleComputed = useCallback(async () => {
    const result = await computedFormula({
      code: codeRef.current,
      context: mockVariablesValue,
      contextDefine: mockVariablesDefine,
    })

    console.log('计算结果: ', result)
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '70vw' }}>
        <FormulaRender
          variables={mockVariablesDefine}
          onAstChange={(ast) => {
            console.log('ast: ', ast)
          }}
          onTokenChange={(tokenInfo) => {
            codeRef.current = tokenInfo.code
            console.log('token info: ', tokenInfo)
          }}
        />
      </div>
      <Button type="primary" onClick={handleComputed}>
        计算
      </Button>
    </div>
  )
}
