import type { WrapTokenDesc } from 'core'
import { WrapTokenParse } from 'core'

import BaseRender from './baseRender'

export default class WrapRender extends BaseRender<WrapTokenDesc> {
  static TokenType = WrapTokenParse.Type

  constructor(token: WrapTokenDesc, type: string) {
    super(token, type)

    this.renderSpace()
  }

  private renderSpace() {
    this.dom.innerText = ''
  }
}
