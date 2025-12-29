import type { TokenDesc } from '@shuttle-formula/core'

import { WrapTokenParse } from '@shuttle-formula/core'

interface DoneFindSubTextNodeOfIndexReturn {
  isDone: true
  node: Node
  index: number
}

interface NotDoneFindSubTextNodeOfIndexReturn {
  isDone: false
  index: number
}

export interface ChangeCursorEvent {
  cursorIndex: number
  refocus: boolean
}

export type ChangeCursorListener = (event: ChangeCursorEvent) => void
export type GetNotEditTokenIds = () => string[]
export type GetTokens = () => TokenDesc<string>[]

export default class Cursor {
  private cursorBeforeLength = -1
  private listeners: ChangeCursorListener[] = []
  getNotEditTokenIds: GetNotEditTokenIds
  readonly getTokens: GetTokens

  static readonly TOKEN_ATTR_NAME = 'data-token-id'

  constructor(getTokens: GetTokens) {
    this.getNotEditTokenIds = () => []
    this.getTokens = getTokens
  }

  changeCursor(cursorBeforeLength: number) {
    const res = this.getTokenWithCodeIndex(cursorBeforeLength)
    if (res && this.getNotEditTokenIds().includes(res.token.id)) {
      if (res.inTokenIndex > 0) {
        cursorBeforeLength =
          cursorBeforeLength - res.inTokenIndex + res.token.code.length
      }
    }

    this.cursorBeforeLength = cursorBeforeLength
    this.triggerListener(this.cursorBeforeLength, false)
  }

  toNextChart(code: string) {
    if (this.cursorBeforeLength === code.length) return

    this.changeCursor(this.cursorBeforeLength + 1)
  }

  toPrevChart() {
    if (this.cursorBeforeLength === 0) return

    let cursorBeforeLength = this.cursorBeforeLength - 1
    const res = this.getTokenWithCodeIndex(cursorBeforeLength)

    if (res && this.getNotEditTokenIds().includes(res.token.id)) {
      if (
        res.inTokenIndex !== res.token.code.length &&
        res.inTokenIndex !== 0
      ) {
        cursorBeforeLength = cursorBeforeLength - res.inTokenIndex
      }
    }

    this.changeCursor(cursorBeforeLength)
  }

  setGetNotEditTokenIds(fn: GetNotEditTokenIds) {
    this.getNotEditTokenIds = fn
  }

  toNextRow(code: string) {
    const cursorIndex = this.cursorBeforeLength

    const cursorAfterCode = code.slice(cursorIndex)
    const codeWithRow = cursorAfterCode.split('\n')
    if (codeWithRow.length <= 1) return

    const cursorBeforeCode = code.slice(0, cursorIndex)
    const beforeCodeWithRow = cursorBeforeCode.split('\n')

    const nextRowLength = this.getChartLenWithBase(
      beforeCodeWithRow[beforeCodeWithRow.length - 1],
      codeWithRow[1],
    )
    this.changeCursor(cursorIndex + codeWithRow[0].length + nextRowLength + 1)
  }

  toPrevRow(code: string) {
    const cursorIndex = this.cursorBeforeLength

    const cursorBeforeCode = code.slice(0, cursorIndex)
    const codeWithRow = cursorBeforeCode.split('\n')
    const rows = codeWithRow.length
    if (rows <= 1) return

    let beforeLastTwoLen = 0
    for (let i = 0; i < rows - 2; i++) {
      beforeLastTwoLen += codeWithRow[i].length + 1
    }

    const prevRowLength = this.getChartLenWithBase(
      codeWithRow[rows - 1],
      codeWithRow[rows - 2],
    )
    this.changeCursor(beforeLastTwoLen + prevRowLength)
  }

  getSelectionRange(code: string) {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed) return

    const anchorId = this.findNearTokenIdByNode(selection.anchorNode)
    const focusId = this.findNearTokenIdByNode(selection.focusNode)

    if (!anchorId || !focusId) return

    let beforeCodeLength = 0
    let start = -1
    let end = -1

    const tokens = this.getTokens()
    for (const token of tokens) {
      if (token.id === anchorId && token.id === focusId) {
        if (this.getNotEditTokenIds().includes(token.id)) {
          start = beforeCodeLength
          end = beforeCodeLength + token.code.length
        } else {
          start =
            beforeCodeLength +
            Math.min(selection.anchorOffset, selection.focusOffset)
          end =
            beforeCodeLength +
            Math.max(selection.anchorOffset, selection.focusOffset)
        }
        break
      } else if (token.id === anchorId) {
        if (start === -1) {
          start = this.getNotEditTokenIds().includes(token.id)
            ? beforeCodeLength
            : beforeCodeLength + selection.anchorOffset
        } else {
          end = this.getNotEditTokenIds().includes(token.id)
            ? beforeCodeLength + token.code.length
            : beforeCodeLength + selection.anchorOffset
        }
      } else if (token.id === focusId) {
        if (start === -1) {
          start = this.getNotEditTokenIds().includes(token.id)
            ? beforeCodeLength
            : beforeCodeLength + selection.focusOffset
        } else {
          end = this.getNotEditTokenIds().includes(token.id)
            ? beforeCodeLength + token.code.length
            : beforeCodeLength + selection.focusOffset
        }
      }

      if (start !== -1 && end !== -1) break

      beforeCodeLength += token.code.length
    }

    if (start === -1 || end === -1) return

    return {
      start,
      code,
      end,
    }
  }

  getFocusToken() {
    const selection = window.getSelection()

    if (!selection || !selection.isCollapsed) return

    const anchorId = this.findNearTokenIdByNode(selection.anchorNode)

    return this.getTokens().find((token) => token.id === anchorId)
  }

  cursorFlowFocus(code: string) {
    let preCodeLength = code.length

    if (preCodeLength) {
      const selection = window.getSelection()
      if (!selection || !selection.isCollapsed) return

      const tokenId = this.findNearTokenIdByNode(selection.focusNode)
      if (!tokenId) return

      preCodeLength = 0
      const tokens = this.getTokens()
      for (const token of tokens) {
        if (token.id === tokenId) {
          let offset = WrapTokenParse.Is(token)
            ? selection.focusOffset + 1
            : selection.focusOffset

          if (this.getNotEditTokenIds().includes(token.id)) {
            offset = offset === 0 ? 0 : token.code.length
          }
          preCodeLength += offset
          break
        }
        preCodeLength += token.code.length
      }
    }

    this.changeCursor(preCodeLength)
    this.focus()
  }

  private getChartLenWithBase(baseStr: string, str: string) {
    let baseStrLength = 0
    for (let i = 0; i < baseStr.length; i++) {
      const charCode = baseStr.charCodeAt(i)
      baseStrLength += this.getSpace(charCode)
    }

    let index = 0
    while (index < str.length && baseStrLength > 0) {
      const charCode = str.charCodeAt(index)
      baseStrLength -= this.getSpace(charCode)

      index++
    }

    return index
  }

  private getSpace(charCode: number) {
    if (charCode > 255) {
      return 2
    }

    return 1
  }

  private findNearTokenIdByNode(node: Node | null): string | undefined {
    if (!node) return

    if (node instanceof Element) {
      const id = node.getAttribute(Cursor.TOKEN_ATTR_NAME)
      if (id) return id
    }

    return this.findNearTokenIdByNode(node.parentNode)
  }

  getCursorIndex() {
    return this.cursorBeforeLength
  }

  focus() {
    const res = this.getTokenWithCodeIndex(this.cursorBeforeLength)
    if (!res) return

    requestAnimationFrame(() => {
      const node = document.querySelectorAll(
        `*[${Cursor.TOKEN_ATTR_NAME}=${res.token.id}]`,
      )

      const isNotEditable = this.getNotEditTokenIds().includes(res.token.id)
      if (isNotEditable) {
        if (res.inTokenIndex !== 0) {
          res.inTokenIndex = node[0].textContent?.length ?? 0
        }
      }

      this.focusNode(node[0], res.inTokenIndex)
      this.triggerListener(this.cursorBeforeLength, true)
    })
  }

  focusNode(node: Node, index: number) {
    const selection = window.getSelection()
    if (!selection) return

    const findRes = this.findSubTextNodeOfIndex(node, index)

    try {
      if (!findRes.isDone) {
        selection.setPosition(node, index)
      } else {
        selection.setPosition(findRes.node, findRes.index)
      }
    } catch (error) {}
  }

  findSubTextNodeOfIndex(
    node: Node,
    index: number,
  ): DoneFindSubTextNodeOfIndexReturn | NotDoneFindSubTextNodeOfIndexReturn {
    let leftLen = index

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i]

      if (child.nodeType === 3) {
        const textContentLength = child.textContent?.length ?? 0
        if (textContentLength >= leftLen) {
          return {
            isDone: true,
            node: child,
            index: leftLen,
          }
        }

        leftLen -= textContentLength
      } else {
        const res = this.findSubTextNodeOfIndex(child, leftLen)
        if (res.isDone) return res

        leftLen = res.index
      }
    }

    return {
      isDone: false,
      index: leftLen,
    }
  }

  getTokenWithCodeIndex(codeIndex: number) {
    if (codeIndex === -1) return

    let codeLen = 0
    const tokens = this.getTokens()
    for (const token of tokens) {
      codeLen += token.code.length
      if (codeLen >= codeIndex) {
        const inTokenIndex = WrapTokenParse.Is(token)
          ? 0
          : token.code.length - (codeLen - codeIndex)

        return {
          token,
          inTokenIndex,
        }
      }
    }
  }

  addListener(listener: ChangeCursorListener) {
    this.listeners.push(listener)
  }

  removeListener(listener?: ChangeCursorListener) {
    if (!listener) {
      this.listeners = []
    } else {
      this.listeners = this.listeners.filter((fn) => fn !== listener)
    }
  }

  private triggerListener(cursorIndex: number, refocus: boolean) {
    this.listeners.forEach((listener) => {
      listener({ cursorIndex, refocus })
    })
  }
}
