import type CodeManager from '../codeManager'

export default class WrapperEvents {
  private readonly codeManager: CodeManager

  private readonly compositionData = { lastValue: '', curValue: '' }
  private inComposition = false

  private dom: HTMLElement | undefined
  private cacheEvent: Record<string, Function> = {}

  constructor(codeManager: CodeManager) {
    this.codeManager = codeManager
  }

  mount(dom: HTMLElement) {
    this.unMount()

    this.dom = dom
    this.addEvent('copy', (e) => {
      this.onCopy(e)
    })
    this.addEvent('cut', (e) => {
      this.onCut(e)
    })
    this.addEvent('paste', (e) => {
      this.onPaste(e)
    })
    this.addEvent('keydown', (e) => {
      this.onKeyDown(e)
    })
    this.addEvent('beforeinput', (e) => {
      this.onBeforeInput(e)
    })
    this.addEvent('compositionstart', () => {
      this.onCompositionStart()
    })
    this.addEvent('compositionupdate', (e) => {
      this.onCompositionUpdate(e)
    })
    this.addEvent('compositionend', (e) => {
      this.onCompositionEnd(e)
    })
    this.addEvent(
      'click',
      () => {
        this.changeCursorWithFactFocus()
      },
      true,
    )
    this.addEvent('focus', () => {
      this.changeCursorWithFactFocus()
    })
    this.addEvent('blur', () => {
      this.onBlur()
    })
  }

  unMount() {
    if (!this.dom) return

    for (const key in this.cacheEvent) {
      this.dom.removeEventListener(key, this.cacheEvent[key] as EventListener)
    }

    this.cacheEvent = {}
    this.dom = undefined
  }

  private addEvent<K extends keyof HTMLElementEventMap>(
    eventKey: K,
    cb: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    deep?: boolean,
  ) {
    if (!this.dom) return

    this.cacheEvent[eventKey] = cb
    this.dom.addEventListener(eventKey, cb, deep)
  }

  private async spliceCodeWithCb(insertCode: string, extraDelete: number = 0) {
    let preCodeLength = 0
    let selectCodeLength = 0
    const rangeInfo = this.codeManager.getSelectionRange()
    if (rangeInfo) {
      preCodeLength = rangeInfo.start
      selectCodeLength = rangeInfo.end - rangeInfo.start
    } else {
      const cursorIndex = this.codeManager.cursor.getCursorIndex()
      preCodeLength = cursorIndex
    }

    if (selectCodeLength === 0) {
      if (preCodeLength >= extraDelete) {
        selectCodeLength = extraDelete
        preCodeLength -= extraDelete
      } else if (!insertCode) {
        return
      }
    }

    await this.codeManager.spliceCode(
      preCodeLength,
      selectCodeLength,
      insertCode,
      true,
      preCodeLength + insertCode.length,
    )
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.inComposition) return

    if (e.code === 'Enter') {
      this.spliceCodeWithCb('\n')
      e.preventDefault()
    } else if (e.code === 'Backspace') {
      const focusToken = this.codeManager.getFocusToken()
      let deleteCount = 1

      if (
        focusToken &&
        this.codeManager.cursor.getNotEditTokenIds().includes(focusToken.id)
      ) {
        deleteCount = focusToken.code.length
      }
      this.spliceCodeWithCb('', deleteCount)
      e.preventDefault()
    } else if (e.code === 'Space') {
      this.spliceCodeWithCb(' ')
      e.preventDefault()
    } else if (e.code === 'Tab') {
      this.spliceCodeWithCb('\t')
      e.preventDefault()
    } else if (e.code === 'ArrowLeft') {
      if (!e.shiftKey) {
        e.preventDefault()

        this.codeManager.focusToPrevChart()
      }
    } else if (e.code === 'ArrowRight') {
      if (!e.shiftKey) {
        e.preventDefault()

        this.codeManager.focusToNextChart()
      }
    } else if (e.code === 'ArrowUp') {
      if (!e.shiftKey) {
        e.preventDefault()

        this.codeManager.focusToPrevRow()
      }
    } else if (e.code === 'ArrowDown') {
      if (!e.shiftKey) {
        e.preventDefault()

        this.codeManager.focusToNextRow()
      }
    }
  }

  private onBeforeInput(e: InputEvent) {
    if (e.data) {
      if (this.inComposition) {
        this.removeCompositionPreValue(this.compositionData.lastValue)
      } else {
        this.spliceCodeWithCb(e.data)
      }
    }
    e.preventDefault()
  }

  private onCompositionStart() {
    this.inComposition = true
  }

  private onCompositionUpdate(e: CompositionEvent) {
    this.compositionData.lastValue = this.compositionData.curValue
    this.compositionData.curValue = e.data
  }

  private onCompositionEnd(e: CompositionEvent) {
    this.inComposition = false
    this.spliceCodeWithCb(e.data)
  }

  private onCopy(e: ClipboardEvent) {
    e.preventDefault()

    const res = this.codeManager.getSelectionRange()
    if (!res) return

    e.clipboardData?.setData('text', res.code.slice(res.start, res.end))
  }

  private onCut(e: ClipboardEvent) {
    e.preventDefault()

    const rangeInfo = this.codeManager.getSelectionRange()
    if (!rangeInfo) return

    const selectCode = rangeInfo.code.slice(rangeInfo.start, rangeInfo.end)
    e.clipboardData?.setData('text', selectCode)

    this.spliceCodeWithCb('')
  }

  private onPaste(e: ClipboardEvent) {
    e.preventDefault()

    const text = e.clipboardData?.getData('text')
    if (!text) return

    this.spliceCodeWithCb(text)
  }

  private changeCursorWithFactFocus() {
    this.codeManager.cursorFlowFocus()
  }

  private onBlur() {
    this.codeManager.cursor.changeCursor(-1)
  }

  private removeCompositionPreValue(preValue: string) {
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const offset = selection?.anchorOffset

    if (!node || offset === undefined) return

    const text = node.textContent ?? ''
    node.textContent = `${text.slice(0, offset)}${text.slice(offset + preValue.length)}`

    selection.setPosition(node, offset)
  }
}
