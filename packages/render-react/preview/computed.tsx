import { useCallback, useEffect, useRef, useState } from 'react'
import { CalculateExpression, useAllComputer } from 'core'

import { useRender } from '../src'

interface Props {
  getVariable?: (path: string[]) => any
  getFunction?: (functionName: string) => Function
}

export default function ComputedFormula({ getVariable, getFunction }: Props) {
  const [value, setValue] = useState<any>('')
  const calculate = useRef(new CalculateExpression())

  const { render } = useRender()

  useEffect(() => {
    useAllComputer(calculate.current)
  }, [])

  useEffect(() => {
    if (getVariable) {
      calculate.current.setGetVariableFu(getVariable)
    }
    if (getFunction) {
      calculate.current.setGetFunctionFu(getFunction)
    }
  }, [getVariable, getFunction])

  const computed = useCallback(async () => {
    const ast = render.codeManager.getAst()
    const value = await calculate.current.execute(
      ast.syntaxRootIds,
      ast.syntaxMap,
    )

    setValue(value)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
      <button onClick={computed}>计算 </button>
      <span style={{ marginLeft: 5 }}>value: {JSON.stringify(value)}</span>
    </div>
  )
}
