export interface SelectOption {
  value: string
  label: string
  extraTip?: React.ReactNode
}

export interface SelectGroup {
  id: string
  label: React.ReactNode
  options: SelectOption[]
}
