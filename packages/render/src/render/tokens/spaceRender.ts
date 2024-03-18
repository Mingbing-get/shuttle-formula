import type { SpaceTokenDesc } from 'core'
import { SpaceTokenParse } from 'core'

import BaseRender from './baseRender'

export default class SpaceRender extends BaseRender<SpaceTokenDesc> {
  static TokenType = SpaceTokenParse.Type

  constructor(token: SpaceTokenDesc, type: string) {
    super(token, type)

    this.renderSpace()
  }

  private renderSpace() {
    this.dom.innerHTML = this.token.code.replaceAll(' ', '&nbsp;')
  }
}
