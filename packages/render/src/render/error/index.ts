import type { WithTokenError } from '../../type'

import BaseTokenRender from '../tokens/baseRender'
import Popover from '../../components/popover'

import { type ErrorDisplay, type ErrorDisplayFactory } from './type'

interface PopoverAndDisplay {
  popover: Popover
  display?: ErrorDisplay
}

export default class ErrorRender {
  private error: WithTokenError | undefined

  private readonly cacheList: PopoverAndDisplay[] = []

  private DisplayFactory?: ErrorDisplayFactory
  private disabled?: boolean

  resetError(error?: WithTokenError) {
    if (this.disabled) {
      this.error = error
      return
    }

    this.clearErrorFromDom()

    this.error = error

    this.setErrorToDom()
  }

  setDisabled(disabled?: boolean) {
    this.disabled = disabled

    if (disabled) {
      this.clearErrorFromDom()
      this.unMount()
    } else {
      this.resetError(this.error)
    }
  }

  setDisplayFactory(displayFactory: ErrorDisplayFactory) {
    this.DisplayFactory = displayFactory
  }

  private clearErrorFromDom() {
    if (!this.error) return

    this.error.tokenIds.forEach((tokenId) => {
      const node = BaseTokenRender.FindDomByTokenId(tokenId)
      node?.classList.remove('has-error')
    })

    this.cacheList.forEach((cache) => {
      cache.popover.disabled(true)
    })
  }

  private setErrorToDom() {
    if (!this.error) return

    this.error.tokenIds.forEach((tokenId, index) => {
      const node = BaseTokenRender.FindDomByTokenId(tokenId)
      if (!node) return

      node.classList.add('has-error')
      this.notifyPopover(node, index)
    })
  }

  private notifyPopover(dom: HTMLElement, index: number) {
    const content = this.error?.syntaxError.msg ?? ''

    if (this.cacheList.length - 1 > index) {
      const { popover, display } = this.cacheList[index]
      display?.updateError(this.error?.syntaxError)
      popover.disabled(false)
      popover.setContent(display?.getRoot() ?? content)
      popover.setTarget(dom)
    } else {
      const newDisplay = this.DisplayFactory
        ? new this.DisplayFactory(this.error?.syntaxError)
        : undefined
      const newPopover = new Popover(dom, newDisplay?.getRoot() ?? content, {
        trigger: 'hover',
        placement: 'top',
        hoverOpenDelay: 200,
      })
      this.cacheList.push({
        popover: newPopover,
        display: newDisplay,
      })
    }
  }

  unMount() {
    this.cacheList.forEach((cache) => {
      cache.popover.disabled(true)
      cache.popover.getHandle().getInstance().destroy()
      cache.display?.remove()
    })

    this.cacheList.length = 0
  }
}
