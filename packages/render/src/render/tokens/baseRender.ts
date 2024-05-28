import type { TokenDesc } from 'core'

import './index.scss'

export default class BaseRender<T extends TokenDesc<string>, E = any> {
  static TokenIdAttr = 'data-token-id'

  protected token: T
  protected type: string
  protected extra?: E

  protected dom: HTMLElement

  constructor(token: T, type: string, extra?: E) {
    this.token = token
    this.type = type
    this.extra = extra

    this.dom = document.createElement('span')
    this.dom.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    this.render()
  }

  private render(isUpdate: boolean = false) {
    const classList = ['editor-token', this.type]

    this.dom.setAttribute('class', classList.join(' '))

    if (!isUpdate) {
      this.dom.setAttribute(BaseRender.TokenIdAttr, this.token.id)
      this.dom.innerText = this.token.code
    }
  }

  updateTypeAndError(type: string, extra?: E) {
    if (this.type === type && this.extra === extra) {
      return
    }

    this.extra = extra
    this.type = type

    this.render(true)
  }

  remove() {
    this.dom.remove()
  }

  getDom() {
    return this.dom
  }

  getInfo() {
    return {
      token: this.token,
      type: this.type,
    }
  }

  static FindDomByTokenId(tokenId: string) {
    return document.querySelector<HTMLElement>(
      `[${BaseRender.TokenIdAttr}=${tokenId}]`,
    )
  }
}
