import { useCallback, useRef, useState } from 'react'
import classNames from 'classnames'
import { Render, useRender } from '@shuttle-formula/render-react'
import { VariableDefine } from '@shuttle-formula/core'
import { Modal } from 'antd'
import { ArrowsAltOutlined } from '@ant-design/icons'

import OnChange, { AstInfo, TokenInfo } from '../onChange'
import { variableCanAcceptFormula } from '../utils'
import ErrorTipRender from './errorTipRender'
import ViewPanel from './viewPanel'
import './index.scss'

interface Props {
  className?: string
  style?: React.CSSProperties
  needAccept?: VariableDefine.Desc | VariableDefine.Desc[]
  disabled?: boolean
}

export default function RenderEditor({
  className,
  style,
  needAccept,
  disabled,
}: Props) {
  const [hasError, setHasError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [showExpand, setShowExpand] = useState(false)
  const codeRef = useRef('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { render } = useRender()

  const handleChangeAst = useCallback(
    (astInfo: AstInfo) => {
      let hasError = false
      if (astInfo.error && codeRef.current) {
        setErrorText(astInfo.error.syntaxError.msg)
        hasError = true
      }

      if (needAccept && astInfo.typeMap) {
        const returnType = astInfo.typeMap.get(
          astInfo.ast.syntaxRootIds?.[0] || '',
        )
        if (returnType) {
          if (needAccept instanceof Array) {
            if (
              needAccept.every(
                (item) => !variableCanAcceptFormula(item, returnType),
              )
            ) {
              setErrorText(
                `当前公式仅接受 ${needAccept.map((item) => item.type).join('、')} 类型的值`,
              )
              hasError = true
            }
          } else {
            if (!variableCanAcceptFormula(needAccept, returnType)) {
              setErrorText(`当前公式仅接受 ${needAccept.type} 类型的值`)
              hasError = true
            }
          }
        }
      }

      if (!hasError) {
        setErrorText('')
      }
      setHasError(hasError)
    },
    [needAccept],
  )

  const handleChangeToken = useCallback((tokenInfo: TokenInfo) => {
    codeRef.current = tokenInfo.code
  }, [])

  const handleShowExpand = useCallback(() => {
    if (wrapperRef.current) {
      const height = wrapperRef.current.offsetHeight
      wrapperRef.current.setAttribute('style', `height: ${height}px`)
    }
    setShowExpand(true)
  }, [])

  const handleHiddenExpand = useCallback(() => {
    const editorWrapper = wrapperRef.current
      ?.firstChild as HTMLDivElement | null
    if (editorWrapper) {
      render.mount(editorWrapper)
      wrapperRef.current?.removeAttribute('style')
    }

    setShowExpand(false)
  }, [])

  return (
    <>
      <OnChange
        onAstChange={handleChangeAst}
        onTokenChange={handleChangeToken}
      />
      <div className="variable-editor-wrapper" ref={wrapperRef}>
        <Render
          className={classNames(
            'variable-editor',
            disabled && 'is-disabled',
            hasError && 'has-error',
            className,
          )}
          style={style}
        />
        <ArrowsAltOutlined
          className="variable-editor-expand-icon"
          onClick={handleShowExpand}
        />
      </div>
      <Modal
        wrapClassName="variable-editor-modal"
        open={showExpand}
        onCancel={handleHiddenExpand}
        footer={null}
        destroyOnHidden
        title="公式"
        width={'60vw'}
      >
        <Render
          className={classNames(
            'variable-editor',
            disabled && 'is-disabled',
            hasError && 'has-error',
            className,
          )}
          style={style}
        />
        <ErrorTipRender tip={errorText} />
        <ViewPanel style={{ marginTop: 2 }} />
      </Modal>
    </>
  )
}
