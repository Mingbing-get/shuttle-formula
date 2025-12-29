import { type SyntaxError } from '@shuttle-formula/core'

export interface ErrorDisplay {
  updateError: (error?: SyntaxError.Desc) => void
  getRoot: () => Node | string
  remove: () => void
}

export type ErrorDisplayFactory = new (error?: SyntaxError.Desc) => ErrorDisplay
