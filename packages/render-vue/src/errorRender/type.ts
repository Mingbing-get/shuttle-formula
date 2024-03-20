import type { SyntaxError } from 'core'
import type { Component } from 'vue'

export interface WithRootError {
  root: HTMLElement
  error?: SyntaxError.Desc
}

export interface ErrorRenderComponentProps {
  error?: SyntaxError.Desc
}

export type ErrorRenderComponent = Component<ErrorRenderComponentProps>
