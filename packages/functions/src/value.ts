function isNullOrUndefined(v: any): v is null | undefined {
  return v === undefined || v === null
}
function toDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`
}
function isDateString(dateStr: string) {
  return /^\d{4}(-|\/)\d{2}(-|\/)\d{2}$/.test(dateStr)
}
function changeDate(fn: (date: Date) => void, dateStr?: string) {
  if (!dateStr) return

  const date = new Date(dateStr)
  if (date.toString() === 'Invalid Date') return

  fn(date)

  if (isDateString(dateStr)) return toDate(date)

  return date.toISOString()
}

function isSameValue(v1: any, v2: any) {
  if (v1 === v2) return true

  if (v1 instanceof Array && v2 instanceof Array) {
    if (v1.length !== v2.length) return false

    const left = [...v2]

    return v1.every((item1) => {
      const index = left.findIndex((item2) => isSameValue(item1, item2))
      if (index === -1) return false

      left.splice(index, 1)

      return true
    })
  }

  if (
    Object.prototype.toString.call(v1) === '[object Object]' &&
    Object.prototype.toString.call(v2) === '[object Object]'
  ) {
    if (Object.keys(v1).length !== Object.keys(v2).length) return false

    for (const key in v1) {
      if (!isSameValue(v1[key], v2[key])) return false
    }
  }

  return false
}

const functionValues: Record<string, Function> = {
  // 日期
  nowDate() {
    return toDate(new Date())
  },
  now() {
    return new Date().toISOString()
  },
  formatDate(_date?: string, format: string = '') {
    if (!_date) return ''

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return ''

    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
      a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
      A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const _k in o) {
      const k = _k as keyof typeof o
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k].toString() : ('00' + o[k]).substring(('' + o[k]).length)
        )
      }
    }
    return format
  },
  getTime(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getTime()
  },
  addYear(_date?: string, year: number = 0) {
    return changeDate((date) => {
      date.setFullYear(date.getFullYear() + year)
    }, _date)
  },
  addMonth(_date?: string, month: number = 0) {
    return changeDate((date) => {
      date.setMonth(date.getMonth() + month)
    }, _date)
  },
  addDay(_date?: string, day: number = 0) {
    return changeDate((date) => {
      date.setDate(date.getDate() + day)
    }, _date)
  },
  addHour(_date?: string, hour: number = 0) {
    return changeDate((date) => {
      date.setHours(date.getHours() + hour)
    }, _date)
  },
  addMinute(_date?: string, minute: number = 0) {
    return changeDate((date) => {
      date.setMinutes(date.getMinutes() + minute)
    }, _date)
  },
  addSecond(_date?: string, second: number = 0) {
    return changeDate((date) => {
      date.setSeconds(date.getSeconds() + second)
    }, _date)
  },
  addMilliSecond(_date?: string, milliSecond: number = 0) {
    return changeDate((date) => {
      date.setMilliseconds(date.getMilliseconds() + milliSecond)
    }, _date)
  },
  getYear(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getFullYear()
  },
  getMonth(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getMonth() + 1
  },
  getDay(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getDate()
  },
  getHour(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getHours()
  },
  getMinute(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getMinutes()
  },
  getSecond(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getSeconds()
  },
  getMilliSecond(_date?: string) {
    if (!_date) return

    const date = new Date(_date)
    if (date.toString() === 'Invalid Date') return

    return date.getMilliseconds()
  },
  setYear(_date?: string, year: number = 0) {
    return changeDate((date) => {
      date.setFullYear(year)
    }, _date)
  },
  setMonth(_date?: string, month: number = 1) {
    return changeDate((date) => {
      date.setMonth(month - 1)
    }, _date)
  },
  setDay(_date?: string, day: number = 0) {
    return changeDate((date) => {
      date.setDate(day)
    }, _date)
  },
  setHour(_date?: string, hour: number = 0) {
    return changeDate((date) => {
      date.setHours(hour)
    }, _date)
  },
  setMinute(_date?: string, minute: number = 0) {
    return changeDate((date) => {
      date.setMinutes(minute)
    }, _date)
  },
  setSecond(_date?: string, second: number = 0) {
    return changeDate((date) => {
      date.setSeconds(second)
    }, _date)
  },
  setMilliSecond(_date?: string, milliSecond: number = 0) {
    return changeDate((date) => {
      date.setMilliseconds(milliSecond)
    }, _date)
  },

  // 字符串
  len(v?: string | any[]) {
    if (!v) return 0

    return v.length
  },
  reverse(v?: string | any[]) {
    if (!v) return

    if (typeof v === 'string') {
      return v.split('').reverse().join('')
    }

    return [...v].reverse()
  },
  mergeString(...list: string[]) {
    return list.join('')
  },
  contains(str1?: string, str2?: string) {
    if (isNullOrUndefined(str1) || isNullOrUndefined(str2)) return false

    return str1.includes(str2)
  },
  stringIndex(str1?: string, str2?: string) {
    if (isNullOrUndefined(str1) || isNullOrUndefined(str2)) return -1

    return str1.indexOf(str2)
  },
  subString(str?: string, start?: number, count?: number) {
    if (isNullOrUndefined(str) || isNullOrUndefined(start) || isNullOrUndefined(count)) return ''

    if (count === 0) return ''

    if (start >= 0) {
      return str.substring(start, count < 0 ? undefined : start + count)
    }

    const factStart = str.length < start ? 0 : str.length + start

    return str.substring(factStart, count < 0 ? undefined : factStart + count)
  },
  lower(str?: string) {
    if (!str) return ''

    return str.toLocaleLowerCase()
  },
  upper(str?: string) {
    if (!str) return ''

    return str.toLocaleUpperCase()
  },
  repeat(str?: string, count?: number) {
    if (!str || !count || count < 0) return ''

    return new Array(count).fill(1).reduce((total: string) => `${total}${str}`, '')
  },
  trim(str?: string) {
    if (!str) return ''

    return str.trim()
  },
  replace(str?: string, baseStr?: string, newStr: string = '') {
    if (!str) return ''
    if (!baseStr) return str

    return str.replace(baseStr, newStr)
  },
  replaceAll(str?: string, baseStr?: string, newStr: string = '') {
    if (!str) return ''
    if (!baseStr) return str

    return str.replace(new RegExp(baseStr, 'g'), newStr)
  },

  // 对象
  createObject(...params: [string, any]) {
    const res: Record<string, any> = {}

    for (let i = 0; i < params.length; i += 2) {
      res[params[i] as string] = params[i + 1]
    }

    return res
  },
  keys(obj?: Record<string, any>) {
    if (!obj) return []

    return Object.keys(obj)
  },
  getValue(obj?: Record<string, any>, key?: string) {
    if (!obj || !key) return

    return obj[key]
  },
  mergeObject(...params: Record<string, any>[]) {
    let value: Record<string, any> = {}

    for (const item of params) {
      value = {
        ...value,
        ...item,
      }
    }

    return value
  },

  // 数组
  createArray(...params: any[]) {
    return params
  },
  arrayContains(arr?: any[], value?: any) {
    if (!arr || isNullOrUndefined(value)) return false

    return arr.includes(value)
  },
  mergeArray(...params: any[][]) {
    return params.flat()
  },
  arrayGet(arr?: any[], index?: number) {
    if (!arr || isNullOrUndefined(index)) return

    return arr[index]
  },
  subArray(arr?: any[], start?: number, count?: number) {
    if (!arr || isNullOrUndefined(start) || isNullOrUndefined(count)) return []

    if (count === 0) return []

    if (start >= 0) {
      return arr.slice(start, count < 0 ? undefined : start + count)
    }

    const factStart = arr.length < start ? 0 : arr.length + start

    return arr.slice(factStart, count < 0 ? undefined : factStart + count)
  },
  sort(arr?: number[] | string[], desc?: boolean) {
    if (!arr?.length) return []

    if (!desc) {
      return [...arr].sort()
    }

    return [...arr].sort().reverse()
  },
  substract(arr1?: any[], arr2?: any[]) {
    if (!arr1 || !arr2) return arr1

    return arr1.filter((item) => !arr2.includes(item))
  },
  arraySum(arr?: number[]) {
    if (!arr) return 0

    return arr.reduce((sum, item) => sum + item, 0)
  },
  arrayAvg(arr?: number[]) {
    if (!arr?.length) return 0

    return arr.reduce((sum, item) => sum + item, 0) / arr.length
  },
  arrayMin(arr?: number[]) {
    if (!arr?.length) return

    return Math.min(...arr)
  },
  arrayMax(arr?: number[]) {
    if (!arr?.length) return

    return Math.max(...arr)
  },
  unique(arr?: any[]) {
    if (!arr) return []

    const res: any[] = []
    for (const item of arr) {
      if (res.includes(item)) continue

      res.push(item)
    }

    return res
  },
  hasAllOf(arr1?: any[], arr2?: any[]) {
    if (!arr2?.length) return true

    if (!arr1?.length) return false

    return arr2.every((item) => arr1.includes(item))
  },
  hasAnyOf(arr1?: any[], arr2?: any[]) {
    if (!arr2?.length || !arr1?.length) return false

    return arr2.some((item) => arr1.includes(item))
  },

  // 类型转换
  anyToString(v?: any) {
    if (isNullOrUndefined(v)) return ''

    return `${v}`
  },
  toNumber(v?: any) {
    if (isNullOrUndefined(v)) return

    return Number(v)
  },
  toJsonString(v?: any) {
    if (isNullOrUndefined(v)) return ''

    return JSON.stringify(v)
  },
  toDate(v?: any) {
    const date = new Date(v)
    if (date.toString() === 'Invalid Date') return

    return toDate(date)
  },
  toDateTime(v?: any) {
    const date = new Date(v)
    if (date.toString() === 'Invalid Date') return

    return date.toISOString()
  },

  // 数学
  round(v?: number) {
    if (isNullOrUndefined(v)) return

    return Math.round(v)
  },
  random() {
    return Math.random()
  },
  roundDown(v?: number) {
    if (isNullOrUndefined(v)) return

    return Math.floor(v)
  },
  roundUp(v?: number) {
    if (isNullOrUndefined(v)) return

    return Math.ceil(v)
  },
  abs(v?: number) {
    if (isNullOrUndefined(v)) return

    return Math.abs(v)
  },
  avg(...v: number[]) {
    if (v.length === 0) return 0

    return v.reduce((sum, item) => item + sum, 0) / v.length
  },
  sum(...v: number[]) {
    if (v.length === 0) return 0

    return v.reduce((sum, item) => item + sum, 0)
  },
  max(...v: number[]) {
    if (v.length === 0) return

    return Math.max(...v)
  },
  min(...v: number[]) {
    if (v.length === 0) return

    return Math.min(...v)
  },
  log(base?: number, num?: number) {
    if (isNullOrUndefined(base) || isNullOrUndefined(num)) return

    return Math.log(num) / Math.log(base)
  },
  logE(num?: number) {
    if (isNullOrUndefined(num)) return

    return Math.log(num)
  },
  mod(num?: number, base?: number) {
    if (isNullOrUndefined(base) || isNullOrUndefined(num)) return

    return num % base
  },
  power(base?: number, num?: number) {
    if (isNullOrUndefined(base) || isNullOrUndefined(num)) return

    return Math.pow(base, num)
  },
  powerE(num?: number) {
    if (isNullOrUndefined(num)) return

    return Math.pow(Math.E, num)
  },
  sqrt(num?: number) {
    if (isNullOrUndefined(num)) return

    return Math.sqrt(num)
  },

  // 逻辑
  if(defaultValue?: any, ...groupParams: any[]) {
    for (let i = 0; i < groupParams.length; i += 2) {
      if (groupParams[i]) return groupParams[i + 1]
    }

    return defaultValue
  },
  isBlank(v: any) {
    if (isNullOrUndefined(v)) return true

    if (v === '') return true

    if (v instanceof Array && v.length === 0) return true

    if (Object.prototype.toString.call(v) === '[object Object]') {
      return Object.keys(v).length === 0
    }

    return false
  },
  isNotBlank(v: any) {
    if (isNullOrUndefined(v)) return false

    if (v === '') return false

    if (v instanceof Array && v.length === 0) return false

    if (Object.prototype.toString.call(v) === '[object Object]') {
      return Object.keys(v).length !== 0
    }

    return true
  },
  equals(...values: any[]) {
    if (values.length < 2) return true

    const first = values[0]
    for (let i = 1; i < values.length; i++) {
      if (!isSameValue(first, values[i])) {
        return false
      }
    }

    return true
  },
}

export default functionValues
