import type {
  Placement,
  VirtualElement,
  PopoverOffset,
} from '../popoverInstance'

export type ArrowSize = 'small' | 'large' | 'middle' | 'none'

export interface PopoverHandleOptions {
  target?: VirtualElement
  arrowSize?: ArrowSize
  placement?: Placement
  widthFollowTarget?: boolean
  offset?: PopoverOffset
}
