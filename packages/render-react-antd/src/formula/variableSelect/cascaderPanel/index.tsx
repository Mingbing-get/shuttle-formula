import { useEffect, useMemo, useState } from 'react'
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import useEffectCallback from '../../../hooks/useEffectCallback'
import useHold from '../../../hooks/useHold'
import useRefEffect from '../../../hooks/useRefEffect'

import './index.scss'

export type CascaderOption<T extends Record<string, any>> = {
  key: string
  title: React.ReactNode
  isLeaf?: boolean
  isDisabled?: boolean
  children?: CascaderOption<T>[]
} & T

export interface CascaderPanelProps<T extends Record<string, any>> {
  style?: React.CSSProperties
  className?: string
  wrapperStyle?: React.CSSProperties
  wrapperClassName?: string
  options: CascaderOption<T>[]
  selectPath?: string[]
  openPath?: string[]
  openOnSelectPath?: boolean
  onSelect?: (selectPath: string[], option: CascaderOption<T>) => void
  onOpen?: (openPath: string[], option?: CascaderOption<T>) => void
  loadMore?: (option: CascaderOption<T>) => Promise<void>
}

export default function CascaderPanel<T extends Record<string, any>>({
  style,
  className,
  openPath,
  selectPath,
  openOnSelectPath,
  onSelect,
  onOpen,
  ...panelProps
}: CascaderPanelProps<T>) {
  const [_openPath, setOpenPath] = useHold(openPath)
  const [_selectPath, setSelectPath] = useHold(selectPath)

  const handleOpen = useEffectCallback(
    (path: string[], option?: CascaderOption<T>) => {
      setOpenPath(path)
      onOpen?.(path, option)
    },
    [onOpen],
  )

  const handleSelect = useEffectCallback(
    (path: string[], option: CascaderOption<T>) => {
      setSelectPath(path)
      onSelect?.(path, option)
    },
    [onSelect],
  )

  useRefEffect(
    [openOnSelectPath, onOpen],
    (
      refOpenOnSelectPath?: boolean,
      refOnOpen?: (path: string[], option?: CascaderOption<T>) => void,
    ) => {
      if (!refOpenOnSelectPath) return

      if (!selectPath) return

      setOpenPath(selectPath)
      refOnOpen?.(selectPath)
    },
    [selectPath?.join('')],
  )

  return (
    <div
      className={classNames('cascader-panel-container', className)}
      style={style}
    >
      <CascaderSinglePanel
        openPath={_openPath}
        selectPath={_selectPath}
        onSelect={handleSelect}
        onOpen={handleOpen}
        {...panelProps}
      />
    </div>
  )
}

function CascaderSinglePanel<T extends Record<string, any>>({
  options,
  wrapperClassName,
  wrapperStyle,
  selectPath,
  openPath,
  onSelect,
  onOpen,
  loadMore,
}: Omit<CascaderPanelProps<T>, 'style' | 'className' | 'openOnSelectPath'>) {
  const [openNextOption, setOpenNextOption] = useState<CascaderOption<T>>()
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const handleLoadMore = useEffectCallback(
    async (option: CascaderOption<T>) => {
      if (!loadMore) return

      setLoadingMap((old) => ({
        ...old,
        [option.key]: true,
      }))

      await loadMore(option)

      setLoadingMap((old) => ({
        ...old,
        [option.key]: false,
      }))
    },
    [loadMore],
  )

  const handleOpenNext = useEffectCallback(
    (path: string[], option?: CascaderOption<T>) => {
      if (option && !option.isLeaf && !option.children?.length) {
        handleLoadMore(option)
      }

      onOpen?.(path, option)
    },
    [onOpen],
  )

  useEffect(() => {
    if (!openPath?.length) {
      setOpenNextOption(undefined)
      return
    }

    const openOption = options.find((option) => option.key === openPath[0])

    if (openOption?.children?.length) {
      setOpenNextOption(openOption)
    } else {
      setOpenNextOption(undefined)
    }
  }, [options, openPath, loadingMap])

  const handleSelect = useEffectCallback(
    (path: string[], option: CascaderOption<T>) => {
      if (option.isDisabled) return

      onSelect?.(path, option)
    },
    [onSelect],
  )

  const nextSelectPath = useMemo(() => {
    if (!openNextOption || !selectPath?.length) return []

    if (openNextOption.key !== selectPath[0]) return []

    return selectPath.slice(1)
  }, [openNextOption, selectPath])

  const nextOpenPath = useMemo(() => {
    if (!openNextOption || !openPath?.length) return []

    if (openNextOption.key !== openPath[0]) return []

    return openPath.slice(1)
  }, [openNextOption, openPath])

  return (
    <>
      <div
        className={classNames('cascader-panel-wrapper', wrapperClassName)}
        style={wrapperStyle}
      >
        {options.map((option) => (
          <div
            className={classNames(
              'cascader-panel-item',
              selectPath?.[0] === option.key && 'is-selected',
              openNextOption?.key === option.key && 'is-open',
              option.isDisabled && 'is-disabled',
            )}
            key={option.key}
          >
            <div
              className="cascader-panel-title"
              onClick={() => handleSelect([option.key], option)}
            >
              {option.title}
            </div>

            {loadingMap[option.key] ? (
              <LoadingOutlined className="cascader-panel-loading-icon" spin />
            ) : (
              (option.children?.length || (loadMore && !option.isLeaf)) && (
                <RightOutlined
                  className="cascader-panel-next-icon"
                  onClick={() =>
                    handleOpenNext(
                      openNextOption?.key === option.key ? [] : [option.key],
                      option,
                    )
                  }
                />
              )
            )}
          </div>
        ))}
      </div>
      {openNextOption?.children && (
        <CascaderSinglePanel
          wrapperClassName={wrapperClassName}
          wrapperStyle={wrapperStyle}
          options={openNextOption.children}
          selectPath={nextSelectPath}
          openPath={nextOpenPath}
          onSelect={(path, option) =>
            handleSelect([openNextOption.key, ...path], option)
          }
          onOpen={(path, option) =>
            handleOpenNext([openNextOption.key, ...path], option)
          }
          loadMore={loadMore}
        />
      )}
    </>
  )
}
