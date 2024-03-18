import type { PopoverHandleOptions, ArrowSize } from '../popoverHandle/type'
import type { PopoverOptions } from './type'

import PopoverHandle from '../popoverHandle'
import Listener from '../../utils/listener'

export default class Popover {
  private readonly _listener: Listener
  private readonly _handle: PopoverHandle
  private readonly _options: Omit<PopoverOptions, keyof PopoverHandleOptions>

  private _target: HTMLElement | SVGSVGElement
  private _content: Node | string

  private counter = 0
  private isHover = false
  private hoverTimer?: number | NodeJS.Timeout

  private cacheEvents: Record<string, EventListener> = {}

  constructor(
    target: HTMLElement | SVGSVGElement,
    content: Node | string,
    options?: PopoverOptions,
  ) {
    this._listener = new Listener()
    this._handle = new PopoverHandle({
      arrowSize: options?.arrowSize,
      placement: options?.placement,
      widthFollowTarget: options?.widthFollowTarget,
      offset: options?.offset,
    })
    this._handle.root().append(content)
    if (options?.visible) {
      this._handle.setTarget(target)
    }

    this._options = {
      trigger: options?.trigger ?? 'click',
      visible: options?.visible,
      preventControlVisible: options?.preventControlVisible,
      delay: options?.delay ?? 500,
      hoverOpenDelay: options?.hoverOpenDelay ?? 0,
    }
    this._target = target
    this._content = content
    this.bindTargetEvent()

    this.init()
  }

  private init() {
    this.addVisibleControl()

    if (
      this._options.trigger !== 'hover' ||
      this._options.preventControlVisible
    )
      return

    const handleMouseenter = () => {
      this.counter++
      this.setVisible(true)
      setTimeout(() => {
        this.counter--
      }, this._options.delay)
    }

    const handleMouseleave = () => {
      setTimeout(() => {
        if (this.counter === 0) this.setVisible(false)
      }, this._options.delay)
    }

    this._handle.root().addEventListener('mouseenter', handleMouseenter)
    this._handle.root().addEventListener('mouseleave', handleMouseleave)
  }

  private domInDisplayOrTarget(dom: Node) {
    let curNode: Node | null = dom
    let flag = false

    while (curNode) {
      if (curNode === this._handle.root() || curNode === this._target) {
        flag = true
        break
      }
      curNode = curNode.parentNode
    }

    return flag
  }

  private addVisibleControl() {
    if (this._options.preventControlVisible) return

    const clickHandle = (e: MouseEvent) => {
      if (!['click', 'focus'].includes(this._options.trigger ?? 'click')) return

      if (this.domInDisplayOrTarget(e.target as Node)) return

      this.setVisible(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // 模拟mouse leave
      if (!this.isHover) return

      if (this.domInDisplayOrTarget(e.target as Node)) return

      this.isHover = false
      clearTimeout(this.hoverTimer)
      setTimeout(() => {
        if (this.counter === 0) {
          this.setVisible(false)
        }
      }, this._options.delay)
    }

    document.body.addEventListener('click', clickHandle)
    document.body.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.removeEventListener('click', clickHandle)
      document.body.removeEventListener('mousemove', handleMouseMove)
    }
  }

  private toggleVisible(e: MouseEvent) {
    this.setVisible(!this._options.visible)
    e.stopPropagation()
    return false
  }

  private bindTargetEvent() {
    if (this._options.preventControlVisible) return

    if (this._options.trigger === 'click') {
      this.bindEventToTarget('click', (e) =>
        this.toggleVisible(e as MouseEvent),
      )
    } else if (this._options.trigger === 'hover') {
      this.bindEventToTarget('mouseenter', () => {
        this.isHover = true
        this.hoverTimer = setTimeout(() => {
          this.counter++
          this.setVisible(true)
          setTimeout(() => {
            this.counter--
          }, this._options.delay)
        }, this._options.hoverOpenDelay)
      })
    } else if (this._options.trigger === 'focus') {
      this.bindEventToTarget('focus', () => this.setVisible(true))
      this.bindEventToTarget('click', (e) => {
        e.stopPropagation()
      })
    }
  }

  private bindEventToTarget(key: string, fn: EventListener) {
    this._target.addEventListener(key, fn)
    this.cacheEvents[key] = fn
  }

  private removeAllEventFromTarget() {
    for (const key in this.cacheEvents) {
      this._target.removeEventListener(key, this.cacheEvents[key])
    }

    this.cacheEvents = {}
  }

  setTarget(target: HTMLElement | SVGSVGElement) {
    this.removeAllEventFromTarget()

    this._target = target

    this.bindTargetEvent()

    this.setVisible(this._options.visible)
  }

  setVisible(visible?: boolean) {
    if (this._options.disabled) return

    this._options.visible = visible

    if (visible) {
      this._handle.setTarget(this._target)
    } else {
      this._handle.setTarget()
    }

    this._listener.trigger('changeVisible', !!visible)

    return this
  }

  disabled(disabled?: boolean) {
    if (disabled) {
      this.setVisible(false)
    }

    this._options.disabled = disabled
  }

  setContent(content: Node | string) {
    this._content = content
    this._handle.setContent(content)
    this._handle.getInstance().forceUpdate()

    return this
  }

  setPlacement(placement: Required<PopoverHandleOptions>['placement']) {
    this._handle.setPlacement(placement)
    return this
  }

  setOffset(offset?: PopoverHandleOptions['offset']) {
    this._handle.setOffset(offset)
    return this
  }

  setArrowSize(arrowSize: ArrowSize) {
    this._handle.setArrowSize(arrowSize)
    return this
  }

  setWidthFollowTarget(
    widthFollowTarget?: PopoverHandleOptions['widthFollowTarget'],
  ) {
    this._handle.setWidthFollowTarget(widthFollowTarget)
    return this
  }

  getHandle() {
    return this._handle
  }

  onChangeVisible(fn: (visible: boolean) => void) {
    this._listener.add('changeVisible', fn)
  }
}
