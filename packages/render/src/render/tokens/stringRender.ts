import type { TokenDesc } from '@shuttle-formula/core'
import type { WithLabelFunction } from '@shuttle-formula/functions'
import type { WithDynamicVariable } from '../../type'

import BaseRender from './baseRender'

export type StringToken = 'TOKEN_STRING'

export default class StringRender extends BaseRender<
  TokenDesc<StringToken>,
  WithDynamicVariable | WithLabelFunction
> {
  static TokenType = 'TOKEN_STRING'

  constructor(token: TokenDesc<StringToken>, type: string) {
    super(token, type)

    this.renderString()
  }

  private renderString() {
    if (this.extra) {
      this.dom.innerHTML = this.extra.label ?? this.token.code
    } else {
      this.dom.innerHTML = this.token.code
    }
  }

  updateTypeAndError(type: string, extra?: WithDynamicVariable) {
    super.updateTypeAndError(type, extra)

    this.renderString()
  }
}
