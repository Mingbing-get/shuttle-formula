import { type SyntaxError } from 'core'

export interface ErrorDisplay {
  updateError: (error?: SyntaxError.Desc) => void
  getRoot: () => Node | string
  remove: () => void
}

export type ErrorDisplayFactory = new (error?: SyntaxError.Desc) => ErrorDisplay
