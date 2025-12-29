import { FunctionGroup } from 'render'

import { FunctionDescription } from './type'

const dateFunctionDefines: FunctionGroup<FunctionDescription>['functions'] = {
  nowDate: {
    label: '当前日期',
    params: [],
    return: { type: 'custom-date' },
    description: {
      define: {
        paramsList: [],
        result: 'date',
      },
      detail: '获取当前日期',
      examples: [{ params: [], result: '2024-11-25' }],
    },
  },
  now: {
    label: '当前日期时间',
    params: [],
    return: { type: 'custom-datetime' },
    description: {
      define: {
        paramsList: [],
        result: 'datetime',
      },
      detail: '获取当前日期时间',
      examples: [{ params: [], result: '2024-11-25T08:10:10.000Z' }],
    },
  },
  formatDate: {
    label: '格式化时间',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'string' } },
    ],
    return: { type: 'string' },
    description: {
      define: {
        paramsList: ['date | datetime', 'string'],
        result: 'string',
      },
      detail:
        '格式化当前时间, 年: y; 月: M; 日: d; 小时: H(h: 12小时制); m: 分钟; s: 秒; S: 毫秒； a: 上午、下午; A: AM、PM',
      examples: [
        {
          tip: '格式化日期',
          params: ['2024-11-25', 'yyyy年MM月dd日'],
          result: '2024年11月25日',
        },
        {
          tip: '格式化日期时间',
          params: ['2024-11-25T08:10:10.000Z', 'yyyy年MM月dd日 HH时mm分ss秒'],
          result: '2024年11月25日 08时10分10秒',
        },
      ],
    },
  },
  getTime: {
    label: '获取时间戳',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
    ],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['date | datetime'],
        result: 'number',
      },
      detail: '获取指定时间的时间戳',
      examples: [
        { params: ['2024-11-25'], result: '1732492800000' },
        { params: ['2024-11-25T08:10:10.000Z'], result: '1732522210000' },
      ],
    },
  },
  addYear: {
    label: '加年',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail:
        '对指定时间增加年, 若年为负数, 则表示减少多少年; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '2'], result: '2026-11-25' },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2022-11-25T08:10:10.000Z',
        },
      ],
    },
  },
  addMonth: {
    label: '加月',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail:
        '对指定时间增加月, 若月为负数, 则表示减少多少月; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '2'], result: '2025-01-25' },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-09-25T08:10:10.000Z',
        },
      ],
    },
  },
  addDay: {
    label: '加天',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail:
        '对指定时间增加天, 若天为负数, 则表示减少多少天; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '2'], result: '2024-11-27' },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-11-23T08:10:10.000Z',
        },
      ],
    },
  },
  addHour: {
    label: '加小时',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间增加小时, 若小时为负数, 则表示减少多少小时',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '2'],
          result: '2024-11-25T10:10:10.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-11-25T06:10:10.000Z',
        },
      ],
    },
  },
  addMinute: {
    label: '加分钟',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间增加分钟, 若分钟为负数, 则表示减少多少分钟',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '2'],
          result: '2024-11-25T08:12:10.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-11-25T08:08:10.000Z',
        },
      ],
    },
  },
  addSecond: {
    label: '加秒',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间增加秒, 若秒为负数, 则表示减少多少秒',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '2'],
          result: '2024-11-25T08:10:12.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-11-25T08:10:08.000Z',
        },
      ],
    },
  },
  addMilliSecond: {
    label: '加毫秒',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间增加毫秒, 若毫秒为负数, 则表示减少多少毫秒',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '2'],
          result: '2024-11-25T08:10:10.002Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '-2'],
          result: '2024-11-25T08:10:09.998Z',
        },
      ],
    },
  },
  getYear: {
    label: '获取年',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
    ],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['T'],
        result: 'number',
      },
      detail: '获取指定时间的年; T: date | datetime',
      examples: [
        { params: ['2024-11-25'], result: '2024' },
        { params: ['2024-11-25T08:10:10.000Z'], result: '2024' },
      ],
    },
  },
  getMonth: {
    label: '获取月',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
    ],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['T'],
        result: 'number',
      },
      detail: '获取指定时间的月; T: date | datetime',
      examples: [
        { params: ['2024-11-25'], result: '11' },
        { params: ['2024-11-25T08:10:10.000Z'], result: '11' },
      ],
    },
  },
  getDay: {
    label: '获取日',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
    ],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['T'],
        result: 'number',
      },
      detail: '获取指定时间的日; T: date | datetime',
      examples: [
        { params: ['2024-11-25'], result: '25' },
        { params: ['2024-11-25T08:10:10.000Z'], result: '25' },
      ],
    },
  },
  getHour: {
    label: '获取小时',
    params: [{ define: { type: 'custom-datetime' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['datetime'],
        result: 'number',
      },
      detail: '获取指定时间的小时',
      examples: [{ params: ['2024-11-25T08:10:10.000Z'], result: '8' }],
    },
  },
  getMinute: {
    label: '获取分钟',
    params: [{ define: { type: 'custom-datetime' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['datetime'],
        result: 'number',
      },
      detail: '获取指定时间的分钟',
      examples: [{ params: ['2024-11-25T08:10:10.000Z'], result: '10' }],
    },
  },
  getSecond: {
    label: '获取秒',
    params: [{ define: { type: 'custom-datetime' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['datetime'],
        result: 'number',
      },
      detail: '获取指定时间的秒',
      examples: [{ params: ['2024-11-25T08:10:10.000Z'], result: '10' }],
    },
  },
  getMilliSecond: {
    label: '获取毫秒',
    params: [{ define: { type: 'custom-datetime' } }],
    return: { type: 'number' },
    description: {
      define: {
        paramsList: ['datetime'],
        result: 'number',
      },
      detail: '获取指定时间的毫秒',
      examples: [{ params: ['2024-11-25T08:10:10.123Z'], result: '123' }],
    },
  },
  setYear: {
    label: '设置年',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail: '对指定时间设置年; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '2020'], result: '2020-11-25' },
        {
          params: ['2024-11-25T08:10:10.000Z', '2020'],
          result: '2020-11-25T08:10:10.000Z',
        },
      ],
    },
  },
  setMonth: {
    label: '设置月',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail:
        '对指定时间设置月, 若月份大于12则自动进位到年; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '6'], result: '2020-06-25' },
        {
          params: ['2024-11-25T08:10:10.000Z', '13'],
          result: '2025-01-25T08:10:10.000Z',
        },
      ],
    },
  },
  setDay: {
    label: '设置日',
    params: [
      { define: [{ type: 'custom-date' }, { type: 'custom-datetime' }] },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['T', 'number'],
        result: 'T',
      },
      detail:
        '对指定时间设置日, 若日期大于当月的最大日期则自动进位到月; T: date | datetime',
      examples: [
        { params: ['2024-11-25', '6'], result: '2020-11-06' },
        {
          params: ['2024-11-25T08:10:10.000Z', '33'],
          result: '2024-12-03T08:10:10.000Z',
        },
      ],
    },
  },
  setHour: {
    label: '设置小时',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间设置小时, 若小时大于24则自动进位到天',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '11'],
          result: '2024-11-25T11:10:10.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '26'],
          result: '2024-11-26T02:10:10.000Z',
        },
      ],
    },
  },
  setMinute: {
    label: '设置分钟',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间设置分钟, 若分钟大于59则自动进位到小时',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '11'],
          result: '2024-11-25T08:11:10.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '63'],
          result: '2024-11-25T09:03:10.000Z',
        },
      ],
    },
  },
  setSecond: {
    label: '设置秒',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间设置秒, 若秒大于59则自动进位到分钟',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '11'],
          result: '2024-11-25T08:10:11.000Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '63'],
          result: '2024-11-25T08:11:03.000Z',
        },
      ],
    },
  },
  setMilliSecond: {
    label: '设置毫秒',
    params: [
      { define: { type: 'custom-datetime' } },
      { define: { type: 'number' } },
    ],
    return: {
      scope: 'forwardParams',
      paramsIndex: 1,
    },
    description: {
      define: {
        paramsList: ['datetime', 'number'],
        result: 'datetime',
      },
      detail: '对指定时间设置毫秒, 若毫秒大于999则自动进位到秒',
      examples: [
        {
          params: ['2024-11-25T08:10:10.000Z', '11'],
          result: '2024-11-25T08:10:10.011Z',
        },
        {
          params: ['2024-11-25T08:10:10.000Z', '1003'],
          result: '2024-11-25T08:10:11.003Z',
        },
      ],
    },
  },
}

export default dateFunctionDefines
