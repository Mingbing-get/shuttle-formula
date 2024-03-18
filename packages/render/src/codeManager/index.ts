import type { TokenDesc, SyntaxDesc } from 'core'
import type {
  WithTokenError,
  GetFunctionDefine,
  GetVariableDefine,
  SyntaxAst,
} from '../type'

import {
  LexicalAnalysis,
  SyntaxDescUtils,
  SyntaxAnalysis,
  useAllTokenParse,
  generateId,
} from 'core'
import Cursor from './cursor'
import AnalysisAst from './analysisAst'

interface TokenInfo {
  code: string
  tokens: TokenDesc<string>[]
  firstUpdateIndex: number
  insertCount: number
  deleteCount: number
}

interface AstInfo {
  ast: SyntaxAst
  error?: WithTokenError
}

interface MemberInfo {
  index: number
  deleteCount: number
  replaceCode: string
  cursorBeforeLength: number
}

interface ListenerMap {
  changeToken: (info: TokenInfo) => void
  changeAst: (info: AstInfo) => void
}

export default class CodeManager {
  private redoList: MemberInfo[] = []
  private readonly undoList: MemberInfo[] = []

  private listeners: Record<string, Function[]> = {}
  readonly cursor: Cursor = new Cursor()

  private executeId: string = ''
  private code: string = ''
  private tokens: TokenDesc<string>[] = []
  private ast: SyntaxAst = { syntaxMap: {}, syntaxRootIds: [] }
  private error: WithTokenError | undefined

  private readonly lexicalAnalysis = new LexicalAnalysis()
  private readonly analysisAst: AnalysisAst

  constructor(useWorker?: boolean) {
    this.analysisAst = new AnalysisAst(useWorker)
    useAllTokenParse(this.lexicalAnalysis)
  }

  setGetVariableDefine(getVariable: GetVariableDefine) {
    this.analysisAst.setGetVariableDefine(getVariable)

    return this
  }

  setGetFunctionDefine(getFunction: GetFunctionDefine) {
    this.analysisAst.setGetFunctionDefine(getFunction)

    return this
  }

  async spliceCode(
    index: number,
    deleteCount: number,
    replaceCode: string,
    remember: boolean = true,
    cursorBeforeLength?: number,
  ) {
    const executeId = generateId()
    this.executeId = executeId

    const updateInfo = await this.lexicalAnalysis.spliceCode(
      index,
      deleteCount,
      replaceCode,
    )

    if (remember) {
      this.undoList.push({
        index,
        deleteCount: replaceCode.length,
        replaceCode: this.code.substring(index, index + deleteCount),
        cursorBeforeLength: this.cursor.getCursorIndex(),
      })
      this.redoList = []
    }

    if (cursorBeforeLength !== undefined) {
      this.cursor.changeCursor(cursorBeforeLength)
    }

    this.code = updateInfo.code
    this.tokens = updateInfo.tokens
    this.error = undefined

    this.triggerListener('changeToken', updateInfo)

    this.analysisAstAndCheck(executeId, updateInfo.tokens)
  }

  private async analysisAstAndCheck(
    executeId: string,
    tokens: TokenDesc<string>[],
  ) {
    const { ast, error } = await this.analysisAst.execute(tokens)

    if (executeId !== this.executeId) return

    this.error = error
    this.ast = ast
    this.triggerListener('changeAst', {
      ast,
      error,
    })
  }

  addListener<K extends keyof ListenerMap>(key: K, listener: ListenerMap[K]) {
    if (!this.listeners[key]) {
      this.listeners[key] = [listener]
    } else {
      this.listeners[key].push(listener)
    }
  }

  removeListener<K extends keyof ListenerMap>(
    key: K,
    listener?: ListenerMap[K],
  ) {
    if (!listener) {
      this.listeners[key] = []
    } else {
      this.listeners[key] = this.listeners[key]?.filter((fn) => fn !== listener)
    }
  }

  private triggerListener<K extends keyof ListenerMap>(
    key: K,
    ...params: Parameters<ListenerMap[K]>
  ) {
    this.listeners[key]?.forEach((listener) => listener(...params))
  }

  findAstByTokenId(tokenId: string): SyntaxDesc<string> | undefined {
    const ast = Object.values(this.ast.syntaxMap)

    for (const currentAst of ast) {
      if (!SyntaxAnalysis.Is(currentAst)) {
        continue
      } else if (SyntaxDescUtils.IsConst(currentAst)) {
        if (currentAst.valueTokens.some((token) => token.id === tokenId)) {
          return currentAst
        }
      } else if (SyntaxDescUtils.IsVariable(currentAst)) {
        if (
          [currentAst.triggerToken, ...currentAst.pathTokens].some(
            (token) => token.id === tokenId,
          )
        ) {
          return currentAst
        }
      } else if (SyntaxDescUtils.IsExpression(currentAst)) {
        if (currentAst.token.id === tokenId) {
          return currentAst
        }
      } else if (SyntaxDescUtils.IsFunction(currentAst)) {
        if (
          [currentAst.triggerToken, ...currentAst.nameTokens].some(
            (token) => token.id === tokenId,
          )
        ) {
          return currentAst
        }
      }
    }
  }

  getTokens() {
    return this.tokens
  }

  getCode() {
    return this.code
  }

  getAst() {
    return this.ast
  }

  getError() {
    return this.error
  }

  canRedo() {
    return this.redoList.length > 0
  }

  canUndo() {
    return this.undoList.length > 0
  }

  redo() {
    const lastMember = this.redoList.pop()
    if (lastMember === undefined) return

    this.undoList.push({
      index: lastMember.index,
      deleteCount: lastMember.replaceCode.length,
      replaceCode: this.code.substring(
        lastMember.index,
        lastMember.index + lastMember.deleteCount,
      ),
      cursorBeforeLength: this.cursor.getCursorIndex(),
    })
    this.spliceCode(
      lastMember.index,
      lastMember.deleteCount,
      lastMember.replaceCode,
      false,
      lastMember.cursorBeforeLength,
    )
  }

  undo() {
    const lastMember = this.undoList.pop()
    if (lastMember === undefined) return

    this.redoList.push({
      index: lastMember.index,
      deleteCount: lastMember.replaceCode.length,
      replaceCode: this.code.substring(
        lastMember.index,
        lastMember.index + lastMember.deleteCount,
      ),
      cursorBeforeLength: this.cursor.getCursorIndex(),
    })
    this.spliceCode(
      lastMember.index,
      lastMember.deleteCount,
      lastMember.replaceCode,
      false,
      lastMember.cursorBeforeLength,
    )
  }

  focus() {
    this.cursor.focus(this.tokens)
  }

  focusToNextChart() {
    this.cursor.toNextChart(this.code)
    this.focus()
  }

  focusToPrevChart() {
    this.cursor.toPrevChart()
    this.focus()
  }

  focusToNextRow() {
    this.cursor.toNextRow(this.code)
    this.focus()
  }

  focusToPrevRow() {
    this.cursor.toPrevRow(this.code)
    this.focus()
  }

  getSelectionRange() {
    return this.cursor.getSelectionRange(this.code, this.tokens)
  }

  cursorFlowFocus() {
    this.cursor.cursorFlowFocus(this.code, this.tokens)
  }

  destroy() {
    this.analysisAst.destroy()
  }
}
