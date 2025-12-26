import type {
  DotSyntaxDesc,
  TokenDesc,
  VariableDefine,
  VariableSyntaxDesc,
} from 'core'
import type {
  FunctionGroup,
  GetDynamicObjectByPath,
  RenderOption,
  WithDynamicVariable,
  WithDynamicVariableObject,
  WithLabelFunction,
} from '../type'

import {
  DotTokenParse,
  LexicalAnalysis,
  SyntaxAnalysis,
  SyntaxDescUtils,
} from 'core'
import CodeManager from '../codeManager'
import WrapperEvents from '../wrapperEvents'
import HotKey from '../hotkey'
import BaseRender from './tokens/baseRender'
import SpaceRender from './tokens/spaceRender'
import TableRender from './tokens/tableRender'
import WrapRender from './tokens/wrapRender'
import StringRender from './tokens/stringRender'
import TipRender from './tip'
import ErrorRender from './error'

import './index.scss'

export interface TokenRender<T extends TokenDesc<string>> {
  new (token: T, type: string): BaseRender<T>
  TokenType: string
}

export default class Render {
  readonly codeManager: CodeManager
  readonly wrapperEvents: WrapperEvents
  readonly hotKey: HotKey
  readonly tipRender: TipRender
  readonly errorRender: ErrorRender

  private notEditTokenIds: string[] = []
  private readonly dom: HTMLDivElement

  private tokens: TokenDesc<string>[] = [
    LexicalAnalysis.CreateStringToken('', 0, 0),
  ]

  private tokenRenderMap: Record<string, TokenRender<any>> = {
    [SpaceRender.TokenType]: SpaceRender,
    [TableRender.TokenType]: TableRender,
    [WrapRender.TokenType]: WrapRender,
    [StringRender.TokenType]: StringRender,
  }

  private tokenRender: Record<string, BaseRender<any>> = {}

  private readonly options: RenderOption = {}

  constructor(options?: RenderOption) {
    if (options) {
      this.options = options
    }

    this.dom = document.createElement('div')

    this.codeManager = new CodeManager(options?.useWorker)
    this.wrapperEvents = new WrapperEvents(this.codeManager)
    this.hotKey = new HotKey()
    this.tipRender = new TipRender(this.codeManager, this)
    this.errorRender = new ErrorRender()

    this.codeManager.cursor.setGetNotEditTokenIds(() => this.notEditTokenIds)

    this.initHotKey()
    this.initDom()
    this.initListener()

    if (options?.code) {
      this.codeManager.resetCode(options.code)
    }
  }

  private initHotKey() {
    this.hotKey.resetOptions([
      {
        ctrlKey: true,
        triggerKey: 'z',
        fn: (e) => {
          e.preventDefault()
          this.codeManager.undo()
        },
      },
      {
        ctrlKey: true,
        triggerKey: 'y',
        fn: (e) => {
          e.preventDefault()
          this.codeManager.redo()
        },
      },
    ])
  }

  private initDom() {
    this.dom.setAttribute('class', 'editor-wrapper')
    if (!this.options.disabled) {
      this.dom.setAttribute('contentEditable', 'true')
    }

    this.dom.addEventListener('click', (e) => {
      e.stopPropagation()
      const children = this.dom.children
      if (!children?.length) return

      requestAnimationFrame(() => {
        const node = children[children.length - 1] as HTMLInputElement
        node.focus()
      })
    })

    const willAppendDoms: HTMLElement[] = []
    this.tokens.forEach((token) => {
      this.tokenRender[token.id] = this.render(token)

      willAppendDoms.push(this.tokenRender[token.id].getDom())
    })
    this.dom.append(...willAppendDoms)

    this.wrapperEvents.mount(this.dom)
    this.hotKey.mount(this.dom)
  }

  private initListener() {
    this.codeManager.addListener('changeToken', (tokenInfo) => {
      const afterFirstTokenIndex =
        tokenInfo.firstUpdateIndex + tokenInfo.deleteCount

      for (let i = tokenInfo.firstUpdateIndex; i < afterFirstTokenIndex; i++) {
        const token = this.tokens[i]
        this.tokenRender[token.id].remove()
        delete this.tokenRender[token.id]
      }

      let lastTokenId: string | undefined
      if (afterFirstTokenIndex < this.tokens.length) {
        lastTokenId = this.tokens[afterFirstTokenIndex].id
      }

      const willAppendDoms: HTMLElement[] = []
      for (
        let i = tokenInfo.firstUpdateIndex;
        i < tokenInfo.firstUpdateIndex + tokenInfo.insertCount;
        i++
      ) {
        const token = tokenInfo.tokens[i]
        this.tokenRender[token.id] = this.render(token)

        willAppendDoms.push(this.tokenRender[token.id].getDom())
      }

      this.tokens = tokenInfo.tokens
      if (willAppendDoms.length === 0) return

      if (lastTokenId) {
        const dom = BaseRender.FindDomByTokenId(lastTokenId)
        if (dom) {
          dom.replaceWith(...willAppendDoms, dom)
        }
      } else {
        this.dom.append(...willAppendDoms)
      }

      this.codeManager.focus()
    })

    this.codeManager.addListener('changeAst', async ({ ast, error }) => {
      const updateTokenType = (tokenId: string, type: string, extra?: any) => {
        this.tokenRender[tokenId].updateTypeAndError(type, extra)
      }

      const notEditTokenIds: string[] = []
      const syntaxList = Object.values(ast.syntaxMap)
      for (const currentAst of syntaxList) {
        if (!SyntaxAnalysis.Is(currentAst)) {
          continue
        } else if (SyntaxDescUtils.IsConst(currentAst)) {
          if (currentAst.constType === 'string') {
            currentAst.valueTokens.forEach((token) => {
              updateTokenType(token.id, 'syntax-string')
            })
          }
        } else if (SyntaxDescUtils.IsVariable(currentAst)) {
          for (const token of currentAst.pathTokens) {
            const path = this.getVariablePathFromAst(currentAst, token)
            const originVariable = await this.getVariableDefine(path)

            if (originVariable) {
              notEditTokenIds.push(token.id)
            }
            updateTokenType(token.id, 'syntax-variable-path', originVariable)
          }
        } else if (SyntaxDescUtils.IsDot(currentAst)) {
          const startVariableDefine = this.codeManager
            .getTypeMap()
            ?.get(currentAst.startSyntaxId)

          let startVariable: Record<string, WithDynamicVariable> = {}
          if (startVariableDefine?.type === 'object') {
            startVariable = startVariableDefine.prototype
          } else if (startVariableDefine?.type === 'array') {
            startVariable = {
              [currentAst.pathTokens[0]?.code]: {
                ...startVariableDefine.item,
                label: '索引',
              },
            }
          }

          for (const token of currentAst.pathTokens) {
            const path = this.getVariablePathFromAst(currentAst, token)
            const variableDefine = await this.getVariable(path, startVariable)

            notEditTokenIds.push(token.id)
            updateTokenType(token.id, 'syntax-variable-path', variableDefine)
          }
        } else if (SyntaxDescUtils.IsFunction(currentAst)) {
          const functionName = currentAst.nameTokens
            .map((nameToken) => nameToken.code)
            .join('')

          currentAst.nameTokens.forEach((token) => {
            const originFunction = this.getFunctionDefine(functionName)

            if (originFunction) {
              notEditTokenIds.push(token.id)
            }
            updateTokenType(token.id, 'syntax-function-name', originFunction)
          })
        }
      }

      this.notEditTokenIds = notEditTokenIds
      this.codeManager.focus()
      this.errorRender.resetError(error)
    })

    this.codeManager.setGetFunctionDefine((functionName: string) =>
      this.getFunctionDefine(functionName),
    )

    this.codeManager.setGetVariableDefine(
      async (path: string[]) => await this.getVariableDefine(path),
    )
  }

  getVariablePathFromAst(
    variableAst: VariableSyntaxDesc | DotSyntaxDesc,
    token?: TokenDesc<string>,
  ) {
    const variablePath: string[] = []
    let tempPath = ''
    for (const pathItem of variableAst.pathTokens) {
      if (DotTokenParse.Is(pathItem)) {
        variablePath.push(tempPath)
        tempPath = ''
      } else {
        tempPath += pathItem.code
      }

      if (pathItem.id === token?.id) {
        break
      }
    }
    if (tempPath.length > 0) {
      variablePath.push(tempPath)
    }

    return variablePath
  }

  getFunctionDefine(functionName: string) {
    if (this.options.functions instanceof Array) {
      for (const group of this.options.functions) {
        if (group.functions[functionName]) {
          return group.functions[functionName]
        }
      }

      return
    }

    return this.options.functions?.[functionName]
  }

  async getVariableDefine(path: string[]) {
    return await this.getVariable(
      path,
      this.options.variables,
      this.options.getDynamicObjectByPath,
    )
  }

  private async getVariable(
    path: string[],
    variables?: Record<string, WithDynamicVariable>,
    getDynamicObjectByPath?: GetDynamicObjectByPath,
  ): Promise<VariableDefine.Desc | undefined> {
    if (path.length === 0 || !variables) return

    let resVar = variables[path[0]]

    for (let i = 1; i < path.length; i++) {
      if (resVar?.type !== 'object') return

      if (this.isWithDynamicObject(resVar)) {
        if (!getDynamicObjectByPath) return

        const factVar = await getDynamicObjectByPath(path.slice(0, i), resVar)
        if (!factVar) return

        resVar = factVar.prototype[path[i]]
      } else {
        resVar = resVar.prototype[path[i]]
      }
    }

    if (resVar && this.isWithDynamicObject(resVar)) {
      if (!getDynamicObjectByPath) return

      return (await getDynamicObjectByPath(path, resVar)) as VariableDefine.Desc
    }

    return resVar as VariableDefine.Desc
  }

  private isWithDynamicObject(
    variable: WithDynamicVariable,
  ): variable is WithDynamicVariableObject {
    return (
      variable.type === 'object' &&
      !(variable as any).prototype &&
      (variable as any).dynamic
    )
  }

  private render(token: TokenDesc<string>) {
    const Render = this.tokenRenderMap[token.type]
    if (Render) {
      return new Render(token, token.type.toLocaleLowerCase())
    }

    return new BaseRender(token, token.type.toLocaleLowerCase())
  }

  useTokenRender<T extends TokenDesc<string>>(render: TokenRender<T>) {
    this.tokenRenderMap[render.TokenType] = render
  }

  setDomStyle(style: string) {
    this.dom.setAttribute('style', style)
  }

  setVariables(variables: Record<string, WithDynamicVariable>) {
    this.options.variables = variables
  }

  setFunctions(functions: Record<string, WithLabelFunction> | FunctionGroup[]) {
    this.options.functions = functions
  }

  updateDisabled(disabled?: boolean) {
    this.options.disabled = disabled
    this.dom.setAttribute('contentEditable', disabled ? 'false' : 'true')
  }

  setGetDynamicObjectByPath(getDynamicObjectByPath: GetDynamicObjectByPath) {
    this.options.getDynamicObjectByPath = getDynamicObjectByPath
  }

  getOption() {
    return this.options
  }

  getNotEditTokenIds() {
    return this.notEditTokenIds
  }

  mount(dom: HTMLElement) {
    this.unMount()

    dom.appendChild(this.dom)
  }

  unMount() {
    this.dom.remove()
  }

  destroy() {
    this.errorRender.unMount()
    this.tipRender.unMount()
    this.wrapperEvents.unMount()
    this.hotKey.unMount()
    this.codeManager.removeListener('changeAst')
    this.codeManager.removeListener('changeToken')
    this.codeManager.cursor.removeListener()
  }
}
