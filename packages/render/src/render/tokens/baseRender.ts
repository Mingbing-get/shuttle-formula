import type { TokenDesc } from 'core'

import './index.scss'

export default class BaseRender<T extends TokenDesc<string>> {
  static TokenIdAttr = 'data-token-id'

  protected token: T
  protected type: string

  protected dom: HTMLElement

  constructor(token: T, type: string) {
    this.token = token
    this.type = type

    this.dom = document.createElement('span')
    this.render()
  }

  private render(isUpdate: boolean = false) {
    const classList = ['editor-token', this.type]

    this.dom.setAttribute('class', classList.join(' '))

    if (!isUpdate) {
      this.dom.setAttribute(BaseRender.TokenIdAttr, this.token.id)
      this.dom.innerText = this.token.code
      this.dom.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    }
  }

  updateTypeAndError(type: string) {
    if (this.type === type) {
      return
    }

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
