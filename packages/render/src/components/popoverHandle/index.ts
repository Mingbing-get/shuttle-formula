import type { PopoverHandleOptions, ArrowSize } from './type'

import Base from '../base'
import PopoverInstance from '../popoverInstance'
import indexManager from '../../utils/indexManager'
import { sliceClass } from '../../utils/helper'

import './index.scss'

export default class PopoverHandle extends Base<HTMLDivElement> {
  private readonly _arrow: HTMLElement

  private readonly instance: PopoverInstance
  _options: PopoverHandleOptions

  constructor(options: PopoverHandleOptions = {}) {
    super(document.createElement('div'))

    this._arrow = document.createElement('div')
    this.instance = new PopoverInstance()
    this._options = { ...options }
    this.init()
  }

  private init() {
    this._root.classList.add('prowler-popper-wrapper')
    this._arrow.classList.add('prowler-arrow')
    this._root.append(this._arrow)
    this._root.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    this._options.arrowSize = this._options.arrowSize ?? 'middle'
    this._options.placement = this._options.placement ?? 'bottom'

    if (this._options.target) {
      this.setTarget(this._options.target)
    }
  }

  private updateRender() {
    if (!this._options.target) return

    this.instance.updateConfig(this._options.target, this._root, {
      placement: this._options.placement ?? 'bottom',
      arrow: this._arrow,
      offset: this._options.offset,
    })
  }

  private updateWidth() {
    if (!this._options.widthFollowTarget) {
      this._root.style.minWidth = ''
    } else {
      if (!this._options.target) return

      const width = this._options.target.getBoundingClientRect().width
      this._root.style.minWidth = `${width}px`
    }
  }

  setTarget(target?: PopoverHandleOptions['target']) {
    this._options.target = target

    const container = document.body
    if (target) {
      if (!container.contains(this._root)) {
        container.append(this._root)
      }
      this._root.style.zIndex = `${indexManager.getIndex()}`
    } else if (container.contains(this._root)) {
      container.removeChild(this._root)
    }

    this.updateWidth()
    this.updateRender()
    return this
  }

  setPlacement(placement: Required<PopoverHandleOptions>['placement']) {
    this._options.placement = placement

    this.updateRender()
    return this
  }

  setOffset(offset?: PopoverHandleOptions['offset']) {
    this._options.offset = offset

    this.updateRender()
    return this
  }

  setArrowSize(arrowSize: ArrowSize) {
    this._options.arrowSize = arrowSize

    const allClassNames: `is-${ArrowSize}`[] = [
      'is-large',
      'is-middle',
      'is-none',
      'is-small',
    ]
    sliceClass(this._arrow, allClassNames, [`is-${arrowSize}`])

    return this
  }

  setWidthFollowTarget(
    widthFollowTarget?: PopoverHandleOptions['widthFollowTarget'],
  ) {
    this._options.widthFollowTarget = widthFollowTarget

    this.updateWidth()
    return this
  }

  setContent(content: Node | string) {
    this._root.replaceChildren(this._arrow, content)
    this.updateWidth()
    return this
  }

  getInstance() {
    return this.instance
  }
}
