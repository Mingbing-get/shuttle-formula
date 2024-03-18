import type {
  SyntaxError,
  SyntaxDesc,
  TokenDesc,
  VariableDefine,
  WithUndefined,
  FunctionDefine,
} from 'core'

import type {
  GetFunctionDefine,
  GetVariableDefine,
  WithTokenError,
} from '../type'

import {
  SyntaxAnalysis,
  SyntaxDescUtils,
  SyntaxCheck,
  useAllChecker,
  generateId,
} from 'core'
import MessageRouter from './messageRouter'
import { functionDefineToTransform, isCustomReturn } from './transformFunction'

// @ts-expect-error
import AnalysisAstWorker from './analysisAstWorker?worker&inline'

interface ExecuteWithWorkerRes {
  ast: {
    syntaxRootIds: string[]
    syntaxMap: Record<string, SyntaxDesc<string>>
  }
  check: SyntaxError.Desc | Map<string, VariableDefine.Desc>
}

export default class AnalysisAst {
  private getVariable: GetVariableDefine | undefined
  private getFunction: GetFunctionDefine | undefined

  private readonly syntaxAnalysis = new SyntaxAnalysis()
  private readonly syntaxCheck = new SyntaxCheck()

  private readonly worker: Worker | undefined
  private executeWithResolve: Record<
    string,
    (value: ExecuteWithWorkerRes) => void
  > = {}

  private getTypeWithResolve: Record<
    string,
    (type: WithUndefined<VariableDefine.Desc>) => void
  > = {}

  private functionCache: Record<string, Function> = {}
  private readonly messageRouter = new MessageRouter()

  constructor(useWorker?: boolean) {
    useAllChecker(this.syntaxCheck)

    if (useWorker && typeof Worker !== 'undefined') {
      this.worker = new AnalysisAstWorker()

      this.worker?.addEventListener('message', (e) => {
        this.messageRouter.onMessage(e.data)
      })
      this.addRouterToMessage()
    }
  }

  setGetVariableDefine(getVariable: GetVariableDefine) {
    this.getVariable = getVariable
    this.syntaxCheck.setGetVariableFu(getVariable)
  }

  setGetFunctionDefine(getFunction: GetFunctionDefine) {
    this.getFunction = getFunction
    this.syntaxCheck.setGetFunctionFu(getFunction)
  }

  async execute(tokens: TokenDesc<string>[]) {
    let executeRes = await this.executeWithWorker(tokens)

    if (!executeRes) {
      this.syntaxAnalysis.setTokenDesc(tokens)
      const ast = await this.syntaxAnalysis.execute()
      const check = await this.syntaxCheck.check(
        ast.syntaxRootIds,
        ast.syntaxMap,
      )

      executeRes = { ast, check }
    }

    const error =
      executeRes.check instanceof Map
        ? undefined
        : this.createError(
            executeRes.check,
            executeRes.ast.syntaxMap[executeRes.check.syntaxId],
          )

    return {
      error,
      ast: executeRes.ast,
    }
  }

  destroy() {
    this.worker?.terminate()
  }

  private createError(
    syntaxError: SyntaxError.Desc,
    errorAst: SyntaxDesc<string>,
  ): WithTokenError | undefined {
    if (!syntaxError) return

    if (!errorAst) {
      let tokenId = syntaxError.syntaxId

      if (typeof tokenId === 'object') {
        tokenId = (tokenId as any).id
      }

      return {
        tokenIds: [tokenId],
        syntaxError,
      }
    }

    const tokenIds: string[] = []
    if (!SyntaxAnalysis.Is(errorAst)) {
      tokenIds.push((errorAst as TokenDesc<string>).id)
    } else if (SyntaxDescUtils.IsConst(errorAst)) {
      tokenIds.push(...errorAst.valueTokens.map((v) => v.id))
    } else if (SyntaxDescUtils.IsVariable(errorAst)) {
      tokenIds.push(
        errorAst.triggerToken.id,
        ...errorAst.pathTokens.map((v) => v.id),
      )
    } else if (SyntaxDescUtils.IsExpression(errorAst)) {
      tokenIds.push(errorAst.token.id)
    } else if (SyntaxDescUtils.IsFunction(errorAst)) {
      tokenIds.push(
        errorAst.triggerToken.id,
        ...errorAst.nameTokens.map((v) => v.id),
      )
    } else if (SyntaxDescUtils.IsUnknown(errorAst)) {
      tokenIds.push(errorAst.token.id)
    }

    return {
      tokenIds,
      syntaxError,
    }
  }

  private async executeWithWorker(tokens: TokenDesc<string>[]) {
    if (!this.worker) return

    return await new Promise<ExecuteWithWorkerRes>((resolve) => {
      const executeId = generateId()

      this.executeWithResolve[executeId] = resolve
      this.postMessage('analysisAst', executeId, tokens)
    })
  }

  private postMessage(route: string, executeId: string, data: any) {
    this.worker?.postMessage({ route, executeId, data })
  }

  private addRouterToMessage() {
    this.messageRouter.use<ExecuteWithWorkerRes>(
      'analysisAst',
      (executeId, data) => {
        if (this.executeWithResolve[executeId]) {
          this.executeWithResolve[executeId](data)
          delete this.executeWithResolve[executeId]
        }
      },
    )

    this.messageRouter.use<string[]>('getVariable', async (executeId, path) => {
      const variableDefine = await this.getVariable?.(path)

      this.postMessage('getVariable', executeId, variableDefine)
    })

    this.messageRouter.use<string>('getFunction', async (executeId, name) => {
      const functionDefine = await this.getFunction?.(name)

      if (!functionDefine || !isCustomReturn(functionDefine.return)) {
        this.postMessage('getFunction', executeId, functionDefine)
      } else {
        const functionName = `${name}_createType`
        this.functionCache[functionName] = this.generateCreateTypeFunction(
          functionDefine.return.createType,
          executeId,
        )
        const newReturn = functionDefineToTransform(
          functionDefine.return,
          functionName,
        )
        this.postMessage('getFunction', executeId, {
          ...functionDefine,
          return: newReturn,
        })
      }
    })

    this.messageRouter.use<{
      functionName: string
      paramsTokens: SyntaxDesc<string>[]
    }>('createType', async (executeId, data) => {
      const functionResult = await this.functionCache[data.functionName]?.(
        ...data.paramsTokens,
      )

      this.postMessage('createType', executeId, functionResult)
    })

    this.messageRouter.use<WithUndefined<VariableDefine.Desc>>(
      'getType',
      (executeId, desc) => {
        if (this.getTypeWithResolve[executeId]) {
          this.getTypeWithResolve[executeId](desc)
          delete this.getTypeWithResolve[executeId]
        }
      },
    )
  }

  private generateCreateTypeFunction(
    originCreateType: FunctionDefine.CustomReturn['createType'],
    getFunctionId: string,
  ) {
    return async (...paramsTokens: SyntaxDesc<string>[]) => {
      return await originCreateType(
        async (syntaxId: string) =>
          await this.getTypeWhenFunctionCreateType(syntaxId, getFunctionId),
        ...paramsTokens,
      )
    }
  }

  private async getTypeWhenFunctionCreateType(
    syntaxId: string,
    getFunctionId: string,
  ) {
    return await new Promise<WithUndefined<VariableDefine.Desc>>((resolve) => {
      const executeId = generateId()

      this.getTypeWithResolve[executeId] = resolve
      this.postMessage('getType', executeId, { syntaxId, getFunctionId })
    })
  }
}
