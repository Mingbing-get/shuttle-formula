import { useRef, useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'

import { SelectOption, SelectGroup } from './type'
import Option from './option'
import Group from './group'
import { isSelectGroup, findOptionInGroupsOrOptions, findNextOptionInGroupsOrOptions } from './utils'

import './index.scss'

interface Props {
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  value?: string
  options: SelectOption[] | SelectGroup[]
  onClickItem?: (option: SelectOption) => void
  onHoverChange?: (value?: string) => void
}

export default function Panel({ wrapperClassName, value, wrapperStyle, options, onClickItem, onHoverChange }: Props) {
  const [hoverValue, setHoverValue] = useState(value)
  const [refresh, setRefresh] = useState(0)
  const selectWrapperRef = useRef<HTMLDivElement>(null)
  const hoverValueRef = useRef(hoverValue)

  useEffect(() => {
    hoverValueRef.current = hoverValue
    onHoverChange?.(hoverValue)
  }, [hoverValue])

  const changeHover = useCallback(
    (step: number) => {
      const nextOption = findNextOptionInGroupsOrOptions(options, step, hoverValueRef.current)
      if (!nextOption) return

      setHoverValue(nextOption.value)
      setRefresh((old) => (old + 1) % 10000)
    },
    [options]
  )

  const handleSelect = useCallback(() => {
    if (!hoverValueRef.current) return

    const item = findOptionInGroupsOrOptions(options, hoverValueRef.current)

    if (!item) return

    onClickItem?.(item)
  }, [options, onClickItem])

  useEffect(() => {
    requestAnimationFrame(async () => {
      if (!selectWrapperRef.current) return
      const selectOption = selectWrapperRef.current.getElementsByClassName('is-hover')[0]
      if (!selectOption) return

      const selectWrapperRect = selectWrapperRef.current.getBoundingClientRect()
      const topDiff = selectOption.getBoundingClientRect().top - selectWrapperRect.top
      selectWrapperRef.current.scrollTop = topDiff - selectWrapperRect.height / 2 + selectWrapperRef.current.scrollTop
    })
  }, [refresh])

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return

      if (e.key === 'ArrowDown') {
        changeHover(1)
      } else if (e.key === 'ArrowUp') {
        changeHover(-1)
      } else if (e.key === 'Enter') {
        handleSelect()
      }

      e.stopPropagation()
      e.preventDefault()
      return false
    }

    window.addEventListener('keydown', keyDown)

    return () => {
      window.removeEventListener('keydown', keyDown)
    }
  }, [changeHover, handleSelect])

  return (
    <div
      ref={selectWrapperRef}
      className={classNames('function-select-wrapper', wrapperClassName)}
      style={wrapperStyle}>
      {options.map((item) => {
        if (isSelectGroup(item)) {
          return (
            <Group
              title={item.label}
              key={item.id}>
              {item.options.map((subItem) => (
                <Option
                  className={classNames({ 'is-select': value === subItem.value, 'is-hover': hoverValue === subItem.value })}
                  {...subItem}
                  key={subItem.value}
                  onClick={(value) => onClickItem?.(subItem)}
                  onMouseEnter={setHoverValue}
                />
              ))}
            </Group>
          )
        }

        return (
          <Option
            className={classNames({ 'is-select': value === item.value, 'is-hover': hoverValue === item.value })}
            {...item}
            key={item.value}
            onClick={(value) => onClickItem?.(item)}
            onMouseEnter={setHoverValue}
          />
        )
      })}
    </div>
  )
}
