import { VNode } from 'vue'

export interface SelectOption {
  value: string
  label: string
  extraTip?: VNode
}

export interface SelectGroup {
  id: string
  label: string
  options: SelectOption[]
}
