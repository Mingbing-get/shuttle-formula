import type { TableTokenDesc } from 'core'
import { TableTokenParse } from 'core'

import BaseRender from './baseRender'

export default class TableRender extends BaseRender<TableTokenDesc> {
  static TokenType = TableTokenParse.Type

  constructor(token: TableTokenDesc, type: string) {
    super(token, type)

    this.renderSpace()
  }

  private renderSpace() {
    this.dom.innerHTML = this.token.code.replaceAll('\t', '&emsp;')
  }
}
