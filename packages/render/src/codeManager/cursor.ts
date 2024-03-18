import type { TokenDesc } from 'core'

import { WrapTokenParse } from 'core'

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

export default class Cursor {
  private cursorBeforeLength = -1
  private listeners: ChangeCursorListener[] = []

  static readonly TOKEN_ATTR_NAME = 'data-token-id'

  changeCursor(cursorBeforeLength: number) {
    this.cursorBeforeLength = cursorBeforeLength
    this.triggerListener(this.cursorBeforeLength, false)
  }

  toNextChart(code: string) {
    if (this.cursorBeforeLength === code.length) return

    this.changeCursor(this.cursorBeforeLength + 1)
  }

  toPrevChart() {
    if (this.cursorBeforeLength === 0) return

    this.changeCursor(this.cursorBeforeLength - 1)
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

  getSelectionRange(code: string, tokens: TokenDesc<string>[]) {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed) return

    const anchorId = this.findNearTokenIdByNode(selection.anchorNode)
    const focusId = this.findNearTokenIdByNode(selection.focusNode)

    if (!anchorId || !focusId) return

    let beforeCodeLength = 0
    let start = -1
    let end = -1

    for (const token of tokens) {
      if (token.id === anchorId && token.id === focusId) {
        start =
          beforeCodeLength +
          Math.min(selection.anchorOffset, selection.focusOffset)
        end =
          beforeCodeLength +
          Math.max(selection.anchorOffset, selection.focusOffset)
        break
      } else if (token.id === anchorId) {
        if (start === -1) {
          start = beforeCodeLength + selection.anchorOffset
        } else {
          end = beforeCodeLength + selection.anchorOffset
        }
      } else if (token.id === focusId) {
        if (start === -1) {
          start = beforeCodeLength + selection.focusOffset
        } else {
          end = beforeCodeLength + selection.focusOffset
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

  cursorFlowFocus(code: string, tokens: TokenDesc<string>[]) {
    let preCodeLength = code.length

    if (preCodeLength) {
      const selection = window.getSelection()
      if (!selection || !selection.isCollapsed) return

      const tokenId = this.findNearTokenIdByNode(selection.focusNode)
      if (!tokenId) return

      preCodeLength = 0
      for (const token of tokens) {
        if (token.id === tokenId) {
          const offset = WrapTokenParse.Is(token)
            ? selection.focusOffset + 1
            : selection.focusOffset
          preCodeLength += offset
          break
        }
        preCodeLength += token.code.length
      }
    }

    this.changeCursor(preCodeLength)
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

  focus(tokens: TokenDesc<string>[]) {
    if (this.cursorBeforeLength === -1) return

    let codeLen = 0
    for (const token of tokens) {
      codeLen += token.code.length
      if (codeLen >= this.cursorBeforeLength) {
        const node = document.querySelectorAll(
          `*[${Cursor.TOKEN_ATTR_NAME}=${token.id}]`,
        )
        const focusIndex = WrapTokenParse.Is(token)
          ? 0
          : token.code.length - (codeLen - this.cursorBeforeLength)

        requestAnimationFrame(() => {
          this.focusNode(node[0], focusIndex)
          this.triggerListener(this.cursorBeforeLength, true)
        })
        break
      }
    }
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
