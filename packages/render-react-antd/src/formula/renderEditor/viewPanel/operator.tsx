import { useCallback, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'

interface TokenOption {
  value: string
  label: string
}

interface TokenOptionGroup {
  groupLabel: string
  id: string
  tokens: TokenOption[]
}

const tokenOptionsWithGroup: TokenOptionGroup[] = [
  {
    groupLabel: '逻辑运算符',
    id: 'logic',
    tokens: [
      {
        value: '&&',
        label: '且',
      },
      {
        value: '||',
        label: '或',
      },
    ],
  },

  {
    groupLabel: '算数运算符',
    id: 'computed',
    tokens: [
      {
        value: '+',
        label: '加',
      },
      {
        value: '-',
        label: '减',
      },
      {
        value: '*',
        label: '乘',
      },
      {
        value: '/',
        label: '除',
      },
      {
        value: '%',
        label: '取余',
      },
    ],
  },

  {
    groupLabel: '比较运算符',
    id: 'compare',
    tokens: [
      {
        value: '==',
        label: '等于',
      },
      {
        value: '!=',
        label: '不等于',
      },
      {
        value: '>=',
        label: '大于等于',
      },
      {
        value: '>',
        label: '大于',
      },
      {
        value: '<=',
        label: '小于等于',
      },
      {
        value: '<',
        label: '小于',
      },
    ],
  },
]

interface Props {
  onPickOperator?: (token: string) => void
}

export default function Operator({ onPickOperator }: Props) {
  const [closeIds, setCloseIds] = useState<string[]>([])

  const handleToggle = useCallback((groupId: string) => {
    setCloseIds((old) => {
      if (old.includes(groupId)) return old.filter((item) => item !== groupId)

      return [...old, groupId]
    })
  }, [])

  return (
    <div className="formula-operator-wrapper">
      {tokenOptionsWithGroup.map((group) => (
        <div className="formula-operator-group" key={group.id}>
          <div className="formula-operator-group-title">
            <DownOutlined
              className="icon-down"
              style={
                closeIds.includes(group.id) ? { rotate: '-90deg' } : undefined
              }
              onClick={() => handleToggle(group.id)}
            />
            <span>{group.groupLabel}</span>
          </div>
          {!closeIds.includes(group.id) && (
            <div className="formula-operator-group-content">
              {group.tokens.map((token) => (
                <div
                  key={token.value}
                  className="formula-operator-group-token"
                  onClick={() => onPickOperator?.(token.value)}
                >
                  {token.value}({token.label})
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
