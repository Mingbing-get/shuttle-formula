import type { VariableSyntaxDesc, FunctionSyntaxDesc, TokenDesc } from 'core'

import type { VirtualElement } from '../../components/popoverInstance'
import type { ChangeCursorEvent } from '../../codeManager/cursor'
import type CodeManager from '../../codeManager'

import type {
  VariablePicker,
  VariableTipOption,
  FunctionPicker,
  FunctionTipOption,
} from './type'

import {
  SyntaxDescUtils,
  DollerTokenParse,
  DotTokenParse,
  AtTokenParse,
} from 'core'
import PopoverHandle from '../../components/popoverHandle'

export default class TipRender {
  private readonly codeManager: CodeManager
  private readonly popoverHandle: PopoverHandle
  private cursorEvent: ChangeCursorEvent = { cursorIndex: -1, refocus: false }
  private tipOption: VariableTipOption | FunctionTipOption | undefined
  private target: VirtualElement | undefined

  private variablePicker: VariablePicker | undefined
  private functionPicker: FunctionPicker | undefined

  private disabled?: boolean
  private delayTimeout: number | NodeJS.Timeout | undefined
  private readonly clickWindowListener: () => void

  constructor(codeManager: CodeManager, disabled?: boolean) {
    this.codeManager = codeManager
    this.disabled = disabled
    this.popoverHandle = new PopoverHandle({
      placement: 'bottom-start',
      arrowSize: 'none',
    })

    this.clickWindowListener = () => {
      this.delaySetCursorEvent({ cursorIndex: -1, refocus: false })
    }

    this.init()
  }

  private init() {
    window.addEventListener('click', this.clickWindowListener)

    this.popoverHandle.root().addEventListener('click', () => {
      clearTimeout(this.delayTimeout)
    })

    this.codeManager.addListener('changeToken', () => {
      this.reComputed()
    })
    this.codeManager.addListener('changeAst', () => {
      this.reComputed()
    })
    this.codeManager.cursor.addListener((e) => {
      this.delaySetCursorEvent(e)
    })
  }

  private delaySetCursorEvent(event: ChangeCursorEvent) {
    if (event.cursorIndex !== -1) {
      clearTimeout(this.delayTimeout)
      this.cursorEvent = event
      this.reComputed()
      return
    }
    this.delayTimeout = setTimeout(() => {
      this.cursorEvent = event
      this.reComputed()
    }, 200)
  }

  private reComputed() {
    const tipOption = this.computedOption(this.cursorEvent.cursorIndex)

    let range: Range | undefined

    if (tipOption) {
      const selection = window.getSelection()
      if (selection?.focusNode) {
        range = selection.getRangeAt(0)
      }
    }

    this.tipOption = tipOption
    this.target = range

    this.reRender()
  }

  private reRender() {
    if (!this.target || !this.tipOption || this.disabled) {
      this.popoverHandle.setTarget(undefined)
      return
    }

    if (this.tipOption.type === 'variable') {
      if (!this.variablePicker) {
        this.popoverHandle.setTarget(undefined)
      } else {
        this.variablePicker.updateTipOption(this.tipOption)
        this.popoverHandle
          .setTarget(this.target)
          .root()
          .replaceChildren(this.variablePicker.getRoot())
      }
    } else {
      if (!this.functionPicker) {
        this.popoverHandle.setTarget(undefined)
      } else {
        this.functionPicker.updateTipOption(this.tipOption)
        this.popoverHandle
          .setTarget(this.target)
          .root()
          .replaceChildren(this.functionPicker.getRoot())
      }
    }
  }

  private handleSelectVariable(path: string[]) {
    if (this.tipOption?.type !== 'variable') return

    const pathTokenIds = this.tipOption.syntax.pathTokens.map(
      (token) => token.id,
    )

    const { beforeCodeLength, excludeTokenLength } =
      this.getCodeWithExcludeToken(
        this.codeManager.getTokens(),
        this.tipOption.syntax.triggerToken.id,
        pathTokenIds,
      )

    const newPathString = path.join('.')
    this.codeManager.spliceCode(
      beforeCodeLength,
      excludeTokenLength,
      newPathString,
      true,
      beforeCodeLength + newPathString.length,
    )
  }

  private handleSelectFunction(functionName: string) {
    if (this.tipOption?.type !== 'function') return

    const functionNameTokenIds = this.tipOption.syntax.nameTokens.map(
      (token) => token.id,
    )

    const { beforeCodeLength, excludeTokenLength } =
      this.getCodeWithExcludeToken(
        this.codeManager.getTokens(),
        this.tipOption.syntax.triggerToken.id,
        functionNameTokenIds,
      )

    this.codeManager.spliceCode(
      beforeCodeLength,
      excludeTokenLength,
      functionName,
      true,
      beforeCodeLength + functionName.length,
    )
  }

  setVariablePicker(variablePicker: VariablePicker) {
    variablePicker.setOnSelect((path) => {
      this.handleSelectVariable(path)
    })
    this.variablePicker = variablePicker

    this.reRender()
  }

  setFunctionPicker(functionPicker: FunctionPicker) {
    functionPicker.setOnSelect((functionName) => {
      this.handleSelectFunction(functionName)
    })
    this.functionPicker = functionPicker

    this.reRender()
  }

  unMount() {
    window.removeEventListener('click', this.clickWindowListener)
    this.popoverHandle.setTarget(undefined)
    this.popoverHandle.getInstance().destroy()
  }

  setDisabled(disabled?: boolean) {
    this.disabled = disabled
    this.reRender()
  }

  private computedOption(
    cursorIndex: number,
  ): VariableTipOption | FunctionTipOption | undefined {
    const inCursorToken = this.getTokenByCursorIndex(
      cursorIndex,
      this.codeManager.getTokens(),
    )
    if (!inCursorToken) return

    const syntaxDesc = this.codeManager.findAstByTokenId(inCursorToken.token.id)
    if (!syntaxDesc) return

    if (SyntaxDescUtils.IsVariable(syntaxDesc)) {
      const path: string[] = []
      if (DollerTokenParse.Is(inCursorToken.token)) {
        if (inCursorToken.index === 0) return
        path.push('')
      } else {
        const lastAddCode = DotTokenParse.Is(inCursorToken.token)
          ? ''
          : inCursorToken.token.code.slice(0, inCursorToken.index)
        path.push(
          ...this.getVariablePathBeforeToken(
            syntaxDesc,
            inCursorToken.token.id,
            lastAddCode,
          ),
        )
      }

      return {
        type: 'variable',
        syntax: syntaxDesc,
        path,
      }
    } else if (SyntaxDescUtils.IsFunction(syntaxDesc)) {
      const nameCodes: string[] = []
      if (!AtTokenParse.Is(inCursorToken.token)) {
        nameCodes.push(
          ...this.getFunctionNameBeforeToken(
            syntaxDesc,
            inCursorToken.token.id,
          ),
        )
        nameCodes.push(inCursorToken.token.code.slice(0, inCursorToken.index))
      } else {
        if (inCursorToken.index === 0) return
      }

      return {
        type: 'function',
        syntax: syntaxDesc,
        name: nameCodes.join(''),
      }
    }
  }

  private getTokenByCursorIndex(
    cursorIndex: number,
    tokens: TokenDesc<string>[],
  ) {
    if (cursorIndex === -1) return

    let codeLen = 0
    for (const token of tokens) {
      codeLen += token.code.length
      if (codeLen >= cursorIndex) {
        const inTokenIndex = token.code.length - (codeLen - cursorIndex)
        return {
          index: inTokenIndex,
          token,
        }
      }
    }
  }

  private getVariablePathBeforeToken(
    syntaxDesc: VariableSyntaxDesc,
    tokenId: string,
    lastAddCode: string,
  ) {
    const path: string[] = []

    const saveKey: string[] = []
    for (const token of syntaxDesc.pathTokens) {
      if (token.id === tokenId) break

      if (DotTokenParse.Is(token)) {
        path.push(saveKey.join(''))
        saveKey.length = 0
      } else {
        saveKey.push(token.code)
      }
    }

    saveKey.push(lastAddCode)
    path.push(saveKey.join(''))

    return path
  }

  private getFunctionNameBeforeToken(
    syntaxDesc: FunctionSyntaxDesc,
    tokenId: string,
  ) {
    const nameCodes: string[] = []

    for (const token of syntaxDesc.nameTokens) {
      if (token.id === tokenId) break

      nameCodes.push(token.code)
    }

    return nameCodes
  }

  private getCodeWithExcludeToken(
    tokens: TokenDesc<string>[],
    triggerId: string,
    excludeIds: string[],
  ) {
    let beforeCodeLength = 0
    let excludeTokenLength = 0
    let meetTrigger = false
    for (const token of tokens) {
      if (!meetTrigger) {
        beforeCodeLength += token.code.length
      } else if (excludeIds.includes(token.id)) {
        excludeTokenLength += token.code.length
      } else {
        break
      }

      if (token.id === triggerId) {
        meetTrigger = true
      }
    }

    return { beforeCodeLength, excludeTokenLength }
  }
}
