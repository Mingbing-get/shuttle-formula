import { SelectGroup, SelectOption } from './type'

export function isSelectGroup(option: SelectOption | SelectGroup): option is SelectGroup {
  return (option as any).options
}

export function isSelectOption(option: SelectOption | SelectGroup): option is SelectOption {
  return !(option as any).options
}

export function findOptionInGroupsOrOptions(options: SelectOption[] | SelectGroup[], value: string): SelectOption | undefined {
  let item: SelectOption | undefined

  for (const option of options) {
    if (isSelectGroup(option)) {
      for (const subOption of option.options) {
        if (subOption.value === value) {
          item = subOption
          break
        }
      }

      if (item) break
    } else {
      if (option.value === value) {
        item = option
        break
      }
    }
  }

  return item
}

export function findNextOptionInGroupsOrOptions(options: SelectOption[] | SelectGroup[], step: number, value?: string): SelectOption | undefined {
  if (options.length === 0) return
  const newOptions: SelectOption[] = []

  options.forEach((option) => {
    if (isSelectGroup(option)) {
      newOptions.push(...option.options)
    } else {
      newOptions.push(option)
    }
  })

  let currentIndex = -1
  if (value) {
    currentIndex = newOptions.findIndex((option) => option.value === value)
  }

  currentIndex += step
  if (currentIndex < 0) {
    currentIndex = newOptions.length - 1
  } else if (currentIndex > newOptions.length - 1) {
    currentIndex = 0
  }

  return newOptions[currentIndex]
}
