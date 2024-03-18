export const vars: Record<string, any> = {
  a: {
    b: {
      c: 11,
    },
    d: 1,
    e: 2,
    f: 3,
  },
  b: 20,
  d: {
    c: 30,
  },
}

export const functions: Record<string, Function> = {
  createObject(...params: [string, any]) {
    const res: Record<string, any> = {}

    for (let i = 0; i < params.length; i += 2) {
      res[params[i] as string] = params[i + 1]
    }

    return res
  },
  createArray(...params: any[]) {
    return params
  },
  len(v: string | Array<any>) {
    return v.length
  },
  round(v: number) {
    return Math.round(v)
  },
  random() {
    return Math.random()
  },
  anyToString(v: any) {
    return `${v}`
  },
}

export function getVar(path: string[]) {
  let v = vars

  for (const key of path) {
    v = v[key]

    if (!v) return v
  }

  return v
}

export function getFunction(name: string) {
  return functions[name]
}
