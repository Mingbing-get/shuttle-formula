import { useEffect } from 'react'
import useEffectCallback from '../../hooks/useEffectCallback'
import { TokenDesc, VariableDefine } from 'core'
import { SyntaxAst, WithTokenError } from 'render'
import { useRender } from 'render-react'

export interface TokenInfo {
  code: string
  tokens: TokenDesc<string>[]
  firstUpdateIndex: number
  insertCount: number
  deleteCount: number
}

export interface AstInfo {
  ast: SyntaxAst
  error?: WithTokenError
  typeMap?: Map<string, VariableDefine.Desc>
}

export interface OnChangeProps {
  onTokenChange?: (tokenInfo: TokenInfo) => void
  onAstChange?: (astInfo: AstInfo) => void
}

export default function OnChange({
  onTokenChange,
  onAstChange,
}: OnChangeProps) {
  const { render } = useRender()

  const handleTokenChange = useEffectCallback(
    (tokenInfo: TokenInfo) => {
      onTokenChange?.(tokenInfo)
    },
    [onTokenChange],
  )

  const handleAstChange = useEffectCallback(
    (astInfo: AstInfo) => {
      onAstChange?.(astInfo)
    },
    [onAstChange],
  )

  useEffect(() => {
    render.codeManager.addListener('changeToken', handleTokenChange)
    render.codeManager.addListener('changeAst', handleAstChange)

    return () => {
      render.codeManager.removeListener('changeToken', handleTokenChange)
      render.codeManager.removeListener('changeAst', handleAstChange)
    }
  }, [])

  return <></>
}
