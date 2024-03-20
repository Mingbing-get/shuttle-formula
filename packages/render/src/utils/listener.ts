export default class Listener {
  private store: Record<string, Function[]>

  constructor() {
    this.store = {}
  }

  add(key: string, f: Function) {
    if (!this.store[key]) {
      this.store[key] = []
    }
    this.store[key].push(f)
  }

  remove(key: string, f?: Function) {
    if (!this.store[key]) return

    if (!f) {
      this.store[key] = []
      return
    }

    this.store[key] = this.store[key].filter((item) => item !== f)
  }

  clear() {
    this.store = {}
  }

  trigger(key: string, ...args: any[]) {
    // eslint-disable-next-line
    this.store[key]?.forEach((f) => f(...args))
  }
}
