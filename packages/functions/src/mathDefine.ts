import { FunctionDescription, FunctionGroup } from './type'

const mathFunctionDefines: FunctionGroup<FunctionDescription>['functions'] = {
  round: {
    label: '四舍五入',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '获取指定数字四舍五入后的结果',
      examples: [
        { params: ['1.4'], result: '1' },
        { params: ['1.6'], result: '2' },
      ],
    },
  },
  random: {
    label: '随机数',
    params: [],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: [],
        result: 'number',
      },
      detail: '生成一个随机数, 大小在0到1之间, 包含0但不包含1',
      examples: [{ params: [], result: '0.5123947872931569' }],
    },
  },
  roundDown: {
    label: '向下取整',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '获取指定数字向下取整后的结果',
      examples: [
        { params: ['1.4'], result: '1' },
        { params: ['1.6'], result: '1' },
      ],
    },
  },
  roundUp: {
    label: '向上取整',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '获取指定数字向上取整后的结果',
      examples: [
        { params: ['1.4'], result: '2' },
        { params: ['1.6'], result: '2' },
      ],
    },
  },
  abs: {
    label: '绝对值',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '获取指定数字的绝对值',
      examples: [
        { params: ['1'], result: '1' },
        { params: ['-1'], result: '1' },
      ],
    },
  },
  avg: {
    label: '平均值',
    params: [{ define: { type: 'number' } }],
    loopAfterParams: 1,
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['...number'],
        result: 'number',
      },
      detail: '计算一组数据的平均值',
      examples: [{ params: ['1', '2', '3'], result: '2' }],
    },
  },
  sum: {
    label: '求和',
    params: [{ define: { type: 'number' } }],
    loopAfterParams: 1,
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['...number'],
        result: 'number',
      },
      detail: '计算一组数据的和',
      examples: [{ params: ['1', '2', '3'], result: '6' }],
    },
  },
  max: {
    label: '最大值',
    params: [{ define: { type: 'number' } }],
    loopAfterParams: 1,
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['...number'],
        result: 'number',
      },
      detail: '计算一组数据的最大值',
      examples: [{ params: ['1', '2', '3'], result: '3' }],
    },
  },
  min: {
    label: '最小值',
    params: [{ define: { type: 'number' } }],
    loopAfterParams: 1,
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['...number'],
        result: 'number',
      },
      detail: '计算一组数据的最小值',
      examples: [{ params: ['1', '2', '3'], result: '1' }],
    },
  },
  log: {
    label: '计算对数',
    params: [{ define: { type: 'number' } }, { define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number', 'number'],
        result: 'number',
      },
      detail: '计算对数, 第一个数为底数, 第二个数为真数',
      examples: [{ params: ['10', '100'], result: '2' }],
    },
  },
  logE: {
    label: '自然对数',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '计算指定数的自然对数',
      examples: [{ params: ['10'], result: '2.302585092994046' }],
    },
  },
  mod: {
    label: '取余',
    params: [{ define: { type: 'number' } }, { define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number', 'number'],
        result: 'number',
      },
      detail: '计算余数',
      examples: [{ params: ['10', '4'], result: '2' }],
    },
  },
  power: {
    label: '计算幂',
    params: [{ define: { type: 'number' } }, { define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number', 'number'],
        result: 'number',
      },
      detail: '计算幂, 第一个数为底, 第二个数为指数',
      examples: [{ params: ['4', '2'], result: '16' }],
    },
  },
  powerE: {
    label: '自然底数求幂',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '计算自然底数的幂',
      examples: [{ params: ['2'], result: '7.3890560989306495' }],
    },
  },
  sqrt: {
    label: '开方',
    params: [{ define: { type: 'number' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['number'],
        result: 'number',
      },
      detail: '指定数开平方后的结果',
      examples: [{ params: ['4'], result: '2' }],
    },
  },
}

export default mathFunctionDefines
