export interface ElementRect {
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

export interface VirtualElement {
  getBoundingClientRect: () => ElementRect
}

export type PopoverDir = 'left' | 'right' | 'top' | 'bottom'

export type Placement =
  | PopoverDir
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

export interface PopoverOffset {
  x?: number
  y?: number
}

export interface PopoverOption {
  placement: Placement
  arrow?: HTMLElement
  offset?: PopoverOffset
}
