import type {
  TokenDesc,
  VariableDefine,
  FunctionDefine,
  WithUndefined,
} from 'core'
import type { TransformFunctionDesc } from './transformFunction'
import type { MessageData } from './messageRouter'

import { SyntaxAnalysis, SyntaxCheck, useAllChecker, generateId } from 'core'
import MessageRouter from './messageRouter'
import { isTransformCustomReturn } from './transformFunction'

const syntaxAnalysis = new SyntaxAnalysis()
const syntaxCheck = new SyntaxCheck()
useAllChecker(syntaxCheck)

const getVariableResolve: Record<
  string,
  (variableDefine: WithUndefined<VariableDefine.Desc>) => void
> = {}
const getVariableWhenDotResolve: Record<
  string,
  (variableDefine: WithUndefined<VariableDefine.Desc>) => void
> = {}
const getFunctionResolve: Record<
  string,
  (functionDefine: WithUndefined<FunctionDefine.Desc>) => void
> = {}
const createTypeResolve: Record<
  string,
  (returnType: FunctionDefine.CustomReturnCreateTypeReturn) => void
> = {}
const getTypeCache: Record<string, FunctionDefine.GetTypeBySyntaxId> = {}
syntaxCheck.setGetVariableFu(async (path: string[]) => {
  return await new Promise<WithUndefined<VariableDefine.Desc>>((resolve) => {
    const executeId = generateId()

    getVariableResolve[executeId] = resolve
    sendMessage('getVariable', executeId, path)
  })
})

syntaxCheck.setGetVariableDefineWhenDot(async (startType, path) => {
  return await new Promise<WithUndefined<VariableDefine.Desc>>((resolve) => {
    const executeId = generateId()

    getVariableWhenDotResolve[executeId] = resolve
    sendMessage('getVariableWhenDot', executeId, { startType, path })
  })
})

syntaxCheck.setGetFunctionFu(async (name: string) => {
  return await new Promise<WithUndefined<FunctionDefine.Desc>>((resolve) => {
    const executeId = generateId()

    getFunctionResolve[executeId] = resolve
    sendMessage('getFunction', executeId, name)
  })
})

// 路由配置
const messageRouter = new MessageRouter()

messageRouter.use<TokenDesc<string>[]>(
  'analysisAst',
  async (executeId, tokens) => {
    syntaxAnalysis.setTokenDesc(tokens)
    const ast = await syntaxAnalysis.execute()
    const check = await syntaxCheck.check(ast.syntaxRootIds, ast.syntaxMap)

    sendMessage('analysisAst', executeId, { ast, check })
  },
)

messageRouter.use<WithUndefined<VariableDefine.Desc>>(
  'getVariable',
  (executeId, variableDefine) => {
    if (getVariableResolve[executeId]) {
      getVariableResolve[executeId](variableDefine)
      delete getVariableResolve[executeId]
    }
  },
)

messageRouter.use<WithUndefined<VariableDefine.Desc>>(
  'getVariableWhenDot',
  (executeId, variableDefine) => {
    if (getVariableWhenDotResolve[executeId]) {
      getVariableWhenDotResolve[executeId](variableDefine)
      delete getVariableWhenDotResolve[executeId]
    }
  },
)

messageRouter.use<WithUndefined<TransformFunctionDesc>>(
  'getFunction',
  (executeId, functionDefine) => {
    if (getFunctionResolve[executeId]) {
      if (!functionDefine || !isTransformCustomReturn(functionDefine.return)) {
        getFunctionResolve[executeId](functionDefine as FunctionDefine.Desc)
      } else {
        const functionName = functionDefine.return.createType
        getFunctionResolve[executeId]({
          ...functionDefine,
          return: {
            scope: 'customReturn',
            createType: async (getType, ...paramsTokens) => {
              getTypeCache[executeId] = getType

              const res =
                await new Promise<FunctionDefine.CustomReturnCreateTypeReturn>(
                  (resolve) => {
                    const createTypeId = generateId()

                    createTypeResolve[createTypeId] = resolve
                    sendMessage('createType', createTypeId, {
                      functionName,
                      paramsTokens,
                    })
                  },
                )

              delete getTypeCache[executeId]
              return res
            },
          },
        })
      }

      delete getFunctionResolve[executeId]
    }
  },
)

messageRouter.use<FunctionDefine.CustomReturnCreateTypeReturn>(
  'createType',
  (executeId, returnType) => {
    if (createTypeResolve[executeId]) {
      createTypeResolve[executeId](returnType)
      delete createTypeResolve[executeId]
    }
  },
)

messageRouter.use<{ syntaxId: string; getFunctionId: string }>(
  'getType',
  async (executeId, data) => {
    if (!getTypeCache[data.getFunctionId]) {
      sendMessage('getType', executeId, undefined)
    } else {
      sendMessage(
        'getType',
        executeId,
        await getTypeCache[data.getFunctionId](data.syntaxId),
      )
    }
  },
)

// worker配置
self.addEventListener('message', (e) => {
  messageRouter.onMessage(e.data as MessageData<any>)
})

function sendMessage(route: string, executeId: string, data: any) {
  try {
    self.postMessage({ route, executeId, data })
  } catch (error) {
    console.log(error)
  }
}
