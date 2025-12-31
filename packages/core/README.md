## `@shuttle-formula/core`

#### 说明

该部分是shuttle-formula的核心包，提供词法分析、语法分析、语法检查、计算表达式等功能

#### 安装

```bash
npm install @shuttle-formula/core
```

#### 词法分析

```ts
import { LexicalAnalysis, useAllTokenParse } from '@shuttle-formula/core'

// 初始化一个词法分析器
const lexicalAnalysis = new LexicalAnalysis()
// 使用内置的词法解析工具
useAllTokenParse(lexicalAnalysis)

// 使用此法分析器分析一段表达式
lexicalAnalysis.setCode('$a.b.c + @sum(10, $a.d) >= 10.8')
const tokens = await lexicalAnalysis.execute()
// 得到分析后的tokens
console.log(tokens)

// 使用更新代码，减少计算时间，如下更新后代码为：$a.test.c + @sum(10, $a.d) >= 10.8
const updateTokens = await lexicalAnalysis.spliceCode(3, 1, 'test')
// 得到更新后的tokens
console.log(updateTokens)
```

#### 语法分析

```ts
import { SyntaxAnalysis } from '@shuttle-formula/core'

// 初始化一个语法分析器
const syntaxAnalysis = new SyntaxAnalysis()

// 将词法分析的结果作为输入，进行语法分析
syntaxAnalysis.setTokenDesc(tokens)
const { syntaxRootIds, syntaxMap } = await syntaxAnalysis.execute()

console.log(syntaxRootIds) // 语法分析后得到的根结点的id列表（可能有多个）
console.log(syntaxMap) // 所有语法结果映射表
```

#### 语法检查

```ts
import { SyntaxCheck, useAllChecker } from '@shuttle-formula/core'

// 初始化一个语法检查器
const syntaxCheck = new SyntaxCheck()
// 使用内置的语法检查规则
useAllChecker(syntaxCheck)

// 设置语法检查时通过变量路径获取变量定义的函数
type GetVariableDefine = (
  path: string[],
) => WithPromise<WithUndefined<VariableDefine.Desc>>

syntaxCheck.setGetVariableFu(fn: GetVariableDefine)
// 设置语法检查时通过函数名称获取函数定义的函数
type GetFunctionDefine = (
  name: string,
) => WithPromise<WithUndefined<FunctionDefine.Desc>>

syntaxCheck.setGetFunctionFu(fn: GetFunctionDefine)

const checkRes = await syntaxCheck.check(syntaxRootIds, syntaxMap)
// 若检查结果有语法错误则返回一个错误对象
// 若检查结果没有语法错误，则返回所有语法块对应的返回值类型
console.log(checkRes)
```

#### 计算表达式

```ts
import { CalculateExpression, useAllComputer } from '@shuttle-formula/core'

// 初始化一个表达式计算器
const calculateExpression = new CalculateExpression()
// 使用内部的计算器
useAllComputer(calculateExpression)

// 设置计算器通过变量路径获取变量值的函数
type GetVariable = (path: string[]) => WithPromise<WithUndefined<any>>

calculateExpression.setGetVariableFu(fn: GetVariable)

// 设置计算器通过函数名获取函数值的函数
type GetFunction = (name: string) => WithPromise<WithUndefined<Function>>

calculateExpression.setGetFunctionFu(fn: GetFunction)

// 通过检查的语法，则可直接放入计算器中进行计算
const value = await calculateExpression.execute(syntaxRootIds, syntaxMap)
console.log(value)
```
