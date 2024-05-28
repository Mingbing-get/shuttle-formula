import { memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { TokenBaseRender } from 'render'

import { useRender } from '../context'

import type { TokenDesc } from 'core'

export interface TokenRenderProps<T extends TokenDesc<string>, E = any> {
  token: T
  type: string
  extra?: E
}

export type TokenRenderComponent<T extends TokenDesc<string>> = (
  props: TokenRenderProps<T>,
) => JSX.Element

interface Props {
  useTokenType: string
  RenderComponent: TokenRenderComponent<any>
}

interface TokenWithType {
  token: TokenDesc<string>
  type: string
  extra?: any
  root: HTMLElement
}

function TokenRender({ useTokenType, RenderComponent }: Props) {
  const { render } = useRender()
  const [tokenWithType, setTokenWithType] = useState<
    Record<string, TokenWithType>
  >({})

  useEffect(() => {
    render.useTokenRender(
      createTokenRenderClass(useTokenType, setTokenWithType),
    )
  }, [])

  return (
    <>
      {Object.entries(tokenWithType).map(([id, item]) =>
        createPortal(
          <RenderComponent
            token={item.token}
            type={item.type}
            extra={item.extra}
          />,
          item.root,
          id,
        ),
      )}
    </>
  )
}

export default memo(TokenRender)

function createTokenRenderClass<T extends TokenDesc<string>>(
  useTokenType: string,
  setTokenWithType: React.Dispatch<
    React.SetStateAction<Record<string, TokenWithType>>
  >,
) {
  class TokenRenderClass extends TokenBaseRender<T> {
    static TokenType = useTokenType

    constructor(token: T, type: string) {
      super(token, type)

      this.renderWithReact()
    }

    private renderWithReact() {
      this.dom.innerText = ''
      setTokenWithType((old) => ({
        ...old,
        [this.token.id]: {
          token: this.token,
          type: this.type,
          root: this.dom,
        },
      }))
    }

    updateTypeAndError(type: string, extra?: any) {
      if (type === this.type && extra === this.extra) return

      super.updateTypeAndError(type)

      setTokenWithType((old) => ({
        ...old,
        [this.token.id]: {
          token: this.token,
          type: this.type,
          root: this.dom,
          extra,
        },
      }))
    }

    remove() {
      setTokenWithType((old) => {
        const newData = { ...old }
        delete newData[this.token.id]

        return newData
      })

      this.dom.remove()
    }
  }

  return TokenRenderClass
}
