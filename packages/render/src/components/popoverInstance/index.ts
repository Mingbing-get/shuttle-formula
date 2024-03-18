import type {
  VirtualElement,
  PopoverOption,
  PopoverDir,
  ElementRect,
  Placement,
} from './type'
import debounceAndThrottle from './debounceAndThrottle'

export * from './type'

interface EnvInfo {
  clientHeight: number
  clientWidth: number
  popperRect: DOMRect
  targetRect: ElementRect
}

const controlCssKeys = ['left', 'right', 'top', 'bottom']

export default class PopoverInstance {
  private target: VirtualElement | undefined
  private popper: HTMLElement | undefined
  private option: PopoverOption
  private isDestroy: boolean
  private readonly listenerCb: () => void

  constructor(
    target?: VirtualElement,
    popper?: HTMLElement,
    option?: PopoverOption,
  ) {
    this.target = target
    this.popper = popper
    this.option = option ?? { placement: 'bottom' }
    this.isDestroy = false
    this.forceUpdate()
    requestAnimationFrame(() => {
      this.forceUpdate()
    })

    this.listenerCb = debounceAndThrottle(() => {
      this.forceUpdate()
    })
    this.addEventListener()
  }

  updateConfig(
    target?: VirtualElement,
    popper?: HTMLElement,
    option?: PopoverOption,
  ) {
    this.target = target
    this.popper = popper
    this.option = option ?? { placement: 'bottom' }
    this.forceUpdate()
    requestAnimationFrame(() => {
      this.forceUpdate()
    })
  }

  forceUpdate() {
    if (this.isDestroy) return

    this.updatePopper(this.option.placement)
  }

  destroy() {
    window.removeEventListener('scroll', this.listenerCb)
    window.removeEventListener('resize', this.listenerCb)
    this.isDestroy = true
  }

  addEventListener() {
    window.addEventListener('scroll', this.listenerCb)
    window.addEventListener('resize', this.listenerCb)
  }

  private async updatePopper(placement: Placement, end: boolean = false) {
    if (!this.target || !this.popper) return

    const envInfo: EnvInfo = {
      clientHeight: window.innerHeight,
      clientWidth: window.innerWidth,
      popperRect: this.popper.getBoundingClientRect(),
      targetRect: this.adjustOffset(this.target.getBoundingClientRect()),
    }

    if (placement === 'right') {
      this.showRight(envInfo, end)
    } else if (placement === 'right-start') {
      this.showRightStart(envInfo, end)
    } else if (placement === 'right-end') {
      this.showRightEnd(envInfo, end)
    } else if (placement === 'left') {
      this.showLeft(envInfo, end)
    } else if (placement === 'left-start') {
      this.showLeftStart(envInfo, end)
    } else if (placement === 'left-end') {
      this.showLeftEnd(envInfo, end)
    } else if (placement === 'top') {
      this.showTop(envInfo, end)
    } else if (placement === 'top-start') {
      this.showTopStart(envInfo, end)
    } else if (placement === 'top-end') {
      this.showTopEnd(envInfo, end)
    } else if (placement === 'bottom') {
      this.showBottom(envInfo, end)
    } else if (placement === 'bottom-start') {
      this.showBottomStart(envInfo, end)
    } else if (placement === 'bottom-end') {
      this.showBottomEnd(envInfo, end)
    }
  }

  private async updateArrow(placement: Placement) {
    if (!this.option.arrow || !this.target) return

    const style: Record<string, any> = {
      ...this.stringToStyle(this.option.arrow.getAttribute('style'), [
        'top',
        'left',
        'right',
        'bottom',
      ]),
      position: 'fixed',
    }
    const dir = this.getDir(placement)

    const targetRect = this.adjustOffset(this.target.getBoundingClientRect())
    const clientHeight = window.innerHeight
    const clientWidth = window.innerWidth

    if (dir === 'left') {
      style.right = clientWidth - targetRect.left
      style.top = targetRect.top + targetRect.height / 2
      style.transform = 'translateY(-50%)'
    } else if (dir === 'right') {
      style.left = targetRect.left + targetRect.width
      style.top = targetRect.top + targetRect.height / 2
      style.transform = 'translateY(-50%)'
    } else if (dir === 'top') {
      style.bottom = clientHeight - targetRect.top
      style.left = targetRect.left + targetRect.width / 2
      style.transform = 'translateX(-50%)'
    } else if (dir === 'bottom') {
      style.top = targetRect.top + targetRect.height
      style.left = targetRect.left + targetRect.width / 2
      style.transform = 'translateX(-50%)'
    }

    this.option.arrow.setAttribute('style', this.styleToString(style))
  }

  private styleToString(style: Record<string, any>) {
    const strList: string[] = []

    for (const key in style) {
      let v = style[key]
      if (controlCssKeys.includes(key)) {
        if (typeof v === 'number') {
          v = `${v}px`
        }
      }
      strList.push(`${key}:${v}`)
    }

    return strList.join(';')
  }

  private stringToStyle(styleStr?: string | null, excludeKeys?: string[]) {
    if (!styleStr) return {}

    const style: Record<string, any> = {}

    const styleList = styleStr.split(';')
    styleList.forEach((item) => {
      const itemSplit = item.split(':')
      if (itemSplit.length < 2 || controlCssKeys.includes(itemSplit[0])) return

      if (excludeKeys?.includes(itemSplit[0].trim())) return

      style[itemSplit[0]] = itemSplit.splice(1).join(':')
    })

    return style
  }

  private executeUpdate(style: Record<string, any>, placement: Placement) {
    if (!this.popper) return

    const _style = {
      ...this.stringToStyle(this.popper.getAttribute('style'), [
        'top',
        'left',
        'right',
        'bottom',
      ]),
      position: 'fixed',
      ...style,
    }

    this.popper.setAttribute('style', this.styleToString(_style))
    const dir = this.getDir(placement)
    const classList = this.popper.classList
    ;['top', 'left', 'right', 'bottom'].forEach((item) => {
      classList.remove(`popper-placement-${item}`)
    })
    this.popper.classList.add(`popper-placement-${dir}`)
    this.updateArrow(placement)
  }

  private showRight(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth } = envInfo

    const style: Record<string, any> = {}
    style.left = targetRect.left + targetRect.width
    style.top = targetRect.top - (popperRect.height - targetRect.height) / 2

    if (!end && style.left + popperRect.width > clientWidth) {
      this.updatePopper('left', true)
      return
    }

    this.adjustTop(style, envInfo)
    this.executeUpdate(style, 'right')
  }

  private showRightStart(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth } = envInfo

    const style: Record<string, any> = {}
    style.left = targetRect.left + targetRect.width
    style.top = targetRect.top

    if (!end && style.left + popperRect.width > clientWidth) {
      this.updatePopper('left-start', true)
      return
    }

    this.adjustTop(style, envInfo)
    this.executeUpdate(style, 'right-start')
  }

  private showRightEnd(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, clientHeight, popperRect, clientWidth } = envInfo

    const style: Record<string, any> = {}
    style.left = targetRect.left + targetRect.width
    style.bottom = clientHeight - (targetRect.top + targetRect.height)

    if (!end && style.left + popperRect.width > clientWidth) {
      this.updatePopper('left-end', true)
      return
    }

    this.adjustBottom(style, envInfo)
    this.executeUpdate(style, 'right-end')
  }

  private showLeft(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth } = envInfo

    const style: Record<string, any> = {}
    style.right = clientWidth - targetRect.left
    style.top = targetRect.top - (popperRect.height - targetRect.height) / 2

    if (!end && style.right + popperRect.width > clientWidth) {
      this.updatePopper('right', true)
      return
    }

    this.adjustTop(style, envInfo)
    this.executeUpdate(style, 'left')
  }

  private showLeftStart(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, clientWidth, popperRect } = envInfo

    const style: Record<string, any> = {}
    style.right = clientWidth - targetRect.left
    style.top = targetRect.top

    if (!end && style.right + popperRect.width > clientWidth) {
      this.updatePopper('right-start', true)
      return
    }

    this.adjustTop(style, envInfo)
    this.executeUpdate(style, 'left-start')
  }

  private showLeftEnd(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.right = clientWidth - targetRect.left
    style.bottom = clientHeight - (targetRect.top + targetRect.height)

    if (!end && style.right + popperRect.width > clientWidth) {
      this.updatePopper('right-end', true)
      return
    }

    this.adjustBottom(style, envInfo)
    this.executeUpdate(style, 'left-end')
  }

  private showTop(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.bottom = clientHeight - targetRect.top
    style.left = targetRect.left - (popperRect.width - targetRect.width) / 2

    if (!end && style.bottom + popperRect.height > clientHeight) {
      this.updatePopper('bottom', true)
      return
    }

    this.adjustLeft(style, envInfo)
    this.executeUpdate(style, 'top')
  }

  private showTopStart(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, clientHeight, popperRect } = envInfo

    const style: Record<string, any> = {}
    style.bottom = clientHeight - targetRect.top
    style.left = targetRect.left

    if (!end && style.bottom + popperRect.height > clientHeight) {
      this.updatePopper('bottom-start', true)
      return
    }

    this.adjustLeft(style, envInfo)
    this.executeUpdate(style, 'top-start')
  }

  private showTopEnd(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.bottom = clientHeight - targetRect.top
    style.right = clientWidth - (targetRect.left + targetRect.width)

    if (!end && style.bottom + popperRect.height > clientHeight) {
      this.updatePopper('bottom-end', true)
      return
    }

    this.adjustRight(style, envInfo)
    this.executeUpdate(style, 'top-end')
  }

  private showBottom(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.top = targetRect.top + targetRect.height
    style.left = targetRect.left - (popperRect.width - targetRect.width) / 2

    if (!end && style.top + popperRect.height > clientHeight) {
      this.updatePopper('top', true)
      return
    }

    this.adjustLeft(style, envInfo)
    this.executeUpdate(style, 'bottom')
  }

  private showBottomStart(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.top = targetRect.top + targetRect.height
    style.left = targetRect.left

    if (!end && style.top + popperRect.height > clientHeight) {
      this.updatePopper('top-start', true)
      return
    }

    this.adjustLeft(style, envInfo)
    this.executeUpdate(style, 'bottom-start')
  }

  private showBottomEnd(envInfo: EnvInfo, end: boolean = false) {
    const { targetRect, popperRect, clientWidth, clientHeight } = envInfo

    const style: Record<string, any> = {}
    style.top = targetRect.top + targetRect.height
    style.right = clientWidth - (targetRect.left + targetRect.width)

    if (!end && style.top + popperRect.height > clientHeight) {
      this.updatePopper('top-end', true)
      return
    }

    this.adjustRight(style, envInfo)
    this.executeUpdate(style, 'bottom-end')
  }

  private adjustBottom(style: Record<string, any>, envInfo: EnvInfo) {
    const { popperRect, clientHeight } = envInfo

    if (style.bottom < 0) {
      style.bottom = 0
    } else if (style.bottom + popperRect.height > clientHeight) {
      delete style.bottom
      style.top = 0
    }
  }

  private adjustTop(style: Record<string, any>, envInfo: EnvInfo) {
    const { popperRect, clientHeight } = envInfo

    if (style.top < 0) {
      style.top = 0
    } else if (style.top + popperRect.height > clientHeight) {
      delete style.top
      style.bottom = 0
    }
  }

  private adjustLeft(style: Record<string, any>, envInfo: EnvInfo) {
    const { popperRect, clientWidth } = envInfo

    if (style.left < 0) {
      style.left = 0
    } else if (style.left + popperRect.width > clientWidth) {
      delete style.left
      style.right = 0
    }
  }

  private adjustRight(style: Record<string, any>, envInfo: EnvInfo) {
    const { popperRect, clientWidth } = envInfo

    if (style.right < 0) {
      style.right = 0
    } else if (style.right + popperRect.width > clientWidth) {
      delete style.right
      style.left = 0
    }
  }

  private adjustOffset(rect: ElementRect): ElementRect {
    if (!this.option.offset) return rect

    const newRect = { ...rect }
    newRect.left += this.option.offset.x ?? 0
    newRect.right += this.option.offset.x ?? 0
    newRect.top += this.option.offset.y ?? 0
    newRect.bottom += this.option.offset.y ?? 0

    return newRect
  }

  private getDir(placement: Placement) {
    const dir = placement.split('-')[0]

    return dir as PopoverDir
  }
}
