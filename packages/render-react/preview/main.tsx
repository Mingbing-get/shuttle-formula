import { BooleanTokenParse } from 'core'
import { Render, Provider, TokenRender, ErrorRender } from '../src'

import {
  vars,
  functionWithGroups,
  getDynamicObjectByPath,
  getVar,
  getFunction,
} from './mock'
import ComputedFormula from './computed'

import type { BooleanTokenDesc } from 'core'
import type { TokenRenderProps, ErrorRenderComponentProps } from '../src'

export default function Main() {
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: 24,
        }}
      >
        <span style={{ marginBottom: 12 }}>不使用worker</span>
        <Provider
          variables={vars}
          functions={functionWithGroups}
          getDynamicObjectByPath={getDynamicObjectByPath}
        >
          <Render
            style={{ borderRadius: 5, boxShadow: '0 0 6px 0 #ccc', width: 400 }}
          />
          <ComputedFormula getVariable={getVar} getFunction={getFunction} />
          <ErrorRender RenderComponent={TestErrorRender} />
          <TokenRender
            useTokenType={BooleanTokenParse.Type}
            RenderComponent={TestTokenTender}
          />
        </Provider>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span style={{ marginBottom: 12 }}>使用worker</span>
        <Provider
          useWorker
          variables={vars}
          functions={functionWithGroups}
          getDynamicObjectByPath={getDynamicObjectByPath}
        >
          <Render
            style={{ borderRadius: 5, boxShadow: '0 0 6px 0 #ccc', width: 400 }}
          />
          <ErrorRender RenderComponent={TestErrorRender} />
          <TokenRender
            useTokenType={BooleanTokenParse.Type}
            RenderComponent={TestTokenTender}
          />
        </Provider>
      </div>
    </div>
  )
}

function TestTokenTender({ token, type }: TokenRenderProps<BooleanTokenDesc>) {
  return <span style={{ color: 'red' }}>{token.code}</span>
}

function TestErrorRender({ error }: ErrorRenderComponentProps) {
  return <div style={{ color: 'blue' }}>自定义错误提示: {error?.msg}</div>
}
