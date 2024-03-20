import { memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { generateId } from 'core'

import { useRender } from '../context'

import type { SyntaxError } from 'core'
import type { ErrorDisplay } from 'render'

export interface ErrorRenderComponentProps {
  error?: SyntaxError.Desc
}

export type ErrorRenderComponent = (
  props: ErrorRenderComponentProps,
) => JSX.Element

interface WithRootError {
  root: HTMLElement
  error?: SyntaxError.Desc
}

interface Props {
  RenderComponent: ErrorRenderComponent
}

function ErrorRender({ RenderComponent }: Props) {
  const { render } = useRender()
  const [withRootError, setWithRootError] = useState<
    Record<string, WithRootError>
  >({})

  useEffect(() => {
    render.errorRender.setDisplayFactory(createErrorDisplay(setWithRootError))
  }, [])

  return (
    <>
      {Object.entries(withRootError).map(([id, item]) =>
        createPortal(<RenderComponent error={item.error} />, item.root, id),
      )}
    </>
  )
}

export default memo(ErrorRender)

function createErrorDisplay(
  setWithRootError: React.Dispatch<
    React.SetStateAction<Record<string, WithRootError>>
  >,
) {
  class ErrorDisplayClass implements ErrorDisplay {
    private readonly root: HTMLDivElement
    private readonly id: string

    constructor(error?: SyntaxError.Desc) {
      this.id = generateId()
      this.root = document.createElement('div')

      setWithRootError((old) => ({
        ...old,
        [this.id]: {
          root: this.root,
          error,
        },
      }))
    }

    updateError(error?: SyntaxError.Desc) {
      setWithRootError((old) => ({
        ...old,
        [this.id]: {
          root: this.root,
          error,
        },
      }))
    }

    getRoot() {
      return this.root
    }

    remove() {
      setWithRootError((old) => {
        const newData = { ...old }
        delete newData[this.id]

        return newData
      })
    }
  }

  return ErrorDisplayClass
}
