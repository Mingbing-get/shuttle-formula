import { useCallback, useRef } from 'react'
import { Button } from 'antd'

import { functionWithGroups, functionValues } from '@shuttle-formula/functions'
import { FormulaHelper } from '@shuttle-formula/render'
import { FormulaRender } from '../src'
import {
  mockVariablesDefine,
  mockVariablesValue,
  getDynamicObjectByPath,
  getDynamicDefineAndValueByPath,
} from './mock'

export default function Main() {
  const codeRef = useRef('')

  const handleComputed = useCallback(async () => {
    const formulaHelper = new FormulaHelper(codeRef.current)

    const result = await formulaHelper.computed({
      variable: mockVariablesValue,
      variableDefine: mockVariablesDefine,
      getDynamicDefineAndValueByPath,
      function: functionValues,
    })

    const dependce = await formulaHelper.getDependceAndCheck({
      variableDefine: mockVariablesDefine,
      functionDefine: functionWithGroups,
      getDynamicObjectByPath,
    })

    console.log('计算结果: ', result)
    console.log('依赖: ', dependce)
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
          functions={functionWithGroups}
          variables={mockVariablesDefine}
          onAstChange={(ast) => {
            console.log('ast: ', ast)
          }}
          onTokenChange={(tokenInfo) => {
            codeRef.current = tokenInfo.code
            console.log('token info: ', tokenInfo)
          }}
          getDynamicObjectByPath={getDynamicObjectByPath}
        />
      </div>
      <Button type="primary" onClick={handleComputed}>
        计算
      </Button>
    </div>
  )
}
