import type { PopoverHandleOptions } from '../popoverHandle/type'

export interface PopoverOptions extends Omit<PopoverHandleOptions, 'target'> {
  trigger?: 'click' | 'hover' | 'focus'
  visible?: boolean
  disabled?: boolean
  preventControlVisible?: boolean
  delay?: number
  hoverOpenDelay?: number
}
