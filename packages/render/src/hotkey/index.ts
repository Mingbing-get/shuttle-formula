import type { WithPromise } from '@shuttle-formula/core'

type KeyCode = string

interface HotKeyOption {
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  triggerKey: KeyCode
  fn: (e: KeyboardEvent) => WithPromise<void>
}

export default class HotKey {
  private readonly options: HotKeyOption[]

  private dom: HTMLElement | undefined
  private readonly listener: (e: KeyboardEvent) => void

  constructor(options: HotKeyOption[] = []) {
    this.options = options
    this.listener = (e) => {
      this.trigger(e)
    }
  }

  private trigger(e: KeyboardEvent) {
    if (e.repeat) return

    const key = e.key.toLowerCase()

    this.options.forEach((option) => {
      if (option.triggerKey !== key) return

      if (option.ctrlKey && !(e.ctrlKey || e.metaKey)) return

      if (option.altKey && !e.altKey) return

      if (option.shiftKey && !e.shiftKey) return

      option.fn(e)
    })
  }

  resetOptions(options: HotKeyOption[]) {
    this.options.length = 0
    this.options.push(...options)
  }

  addOption(option: HotKeyOption) {
    this.options.push(option)
  }

  mount(dom: HTMLElement) {
    this.unMount()

    this.dom = dom
    dom.addEventListener('keydown', this.listener)
  }

  unMount() {
    if (!this.dom) return

    this.dom.removeEventListener('keydown', this.listener)
    this.dom = undefined
  }
}
