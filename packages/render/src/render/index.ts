import type { TokenDesc, VariableDefine } from 'core'
import type {
  FunctionGroup,
  GetDynamicObjectByPath,
  RenderOption,
  WithDynamicVariable,
  WithDynamicVariableObject,
  WithLabelFunction,
} from '../type'

import { LexicalAnalysis, SyntaxAnalysis, SyntaxDescUtils } from 'core'
import CodeManager from '../codeManager'
import WrapperEvents from '../wrapperEvents'
import HotKey from '../hotkey'
import BaseRender from './tokens/baseRender'
import SpaceRender from './tokens/spaceRender'
import TableRender from './tokens/tableRender'
import WrapRender from './tokens/wrapRender'
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

  private readonly dom: HTMLDivElement

  private tokens: TokenDesc<string>[] = [
    LexicalAnalysis.CreateStringToken('', 0, 0),
  ]

  private tokenRenderMap: Record<string, TokenRender<any>> = {
    [SpaceRender.TokenType]: SpaceRender,
    [TableRender.TokenType]: TableRender,
    [WrapRender.TokenType]: WrapRender,
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
    this.tipRender = new TipRender(this.codeManager)
    this.errorRender = new ErrorRender()

    this.initHotKey()
    this.initDom()
    this.initListener()

    if (options?.code) {
      this.codeManager.spliceCode(0, 0, options.code, false)
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
    this.dom.setAttribute('contentEditable', 'true')

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

    this.codeManager.addListener('changeAst', ({ ast, error }) => {
      const updateTokenType = (tokenId: string, type: string) => {
        this.tokenRender[tokenId].updateTypeAndError(type)
      }

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
          currentAst.pathTokens.forEach((token) => {
            updateTokenType(token.id, 'syntax-variable-path')
          })
        } else if (SyntaxDescUtils.IsFunction(currentAst)) {
          currentAst.nameTokens.forEach((token) => {
            updateTokenType(token.id, 'syntax-function-name')
          })
        }
      }

      this.errorRender.resetError(error)
    })

    this.codeManager.setGetFunctionDefine((functionName: string) =>
      this.getFunctionDefine(functionName),
    )

    this.codeManager.setGetVariableDefine(
      async (path: string[]) => await this.getVariableDefine(path),
    )
  }

  private getFunctionDefine(functionName: string) {
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

  private async getVariableDefine(path: string[]) {
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

  setGetDynamicObjectByPath(getDynamicObjectByPath: GetDynamicObjectByPath) {
    this.options.getDynamicObjectByPath = getDynamicObjectByPath
  }

  getOption() {
    return this.options
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
