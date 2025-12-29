export interface FunctionDescriptionExample {
  tip?: string
  params: string[]
  result: string
}

export interface FunctionDescriptionDefine {
  paramsList: string[]
  result: string
}

export interface FunctionDescription {
  define: FunctionDescriptionDefine
  detail: string
  examples: FunctionDescriptionExample[]
}
