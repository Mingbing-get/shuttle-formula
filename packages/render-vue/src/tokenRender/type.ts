import { Component } from 'vue'
import { TokenDesc } from 'core'

export interface TokenRenderProps<T extends TokenDesc<string>> {
  token: T
  type: string
}

export type TokenRenderComponent<T extends TokenDesc<string>> = Component<
  TokenRenderProps<T>
>

export interface TokenWithType {
  token: TokenDesc<string>
  type: string
  root: HTMLElement
}
