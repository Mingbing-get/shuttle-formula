<template>
  <OnChange @astChange="handleChangeAst" @tokenChange="handleChangeToken" />
  <div class="variable-editor-wrapper" ref="wrapperRef">
    <Render
      :class="[
        'variable-editor',
        disabled && 'is-disabled',
        hasError && 'has-error',
        props.class,
      ]"
      :style="props.style"
    />
    <ArrowsAltOutlined
      class="variable-editor-expand-icon"
      @click="handleShowExpand"
    />
  </div>
  <ElDialog
    class="variable-editor-modal"
    :model-value="showExpand"
    @cancel="handleHiddenExpand"
    @close="handleHiddenExpand"
    :footer="null"
    :destroy-on-close="true"
    title="公式"
    width="60vw"
  >
    <Render
      :class="[
        'variable-editor',
        disabled && 'is-disabled',
        hasError && 'has-error',
        props.class,
      ]"
      :style="props.style"
    />
    <ErrorTipRender :tip="errorText" />
    <ViewPanel style="margin-top: 2px" />
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Render, useRender } from '@shuttle-formula/render-vue'
import { VariableDefine } from '@shuttle-formula/core'
import { ElDialog } from 'element-plus'
import { WithDynamicVariable } from '@shuttle-formula/render'

import OnChange, { AstInfo, TokenInfo } from '../onChange/index.vue'
import { variableCanAcceptFormula } from '../utils'
import ErrorTipRender from './errorTipRender.vue'
import ViewPanel from './viewPanel/index.vue'
import ArrowsAltOutlined from '../../components/arrowsAltOutlined.vue'

import 'element-plus/es/components/dialog/style/css'

interface Props {
  class?: string
  style?: string
  accept?:
    | VariableDefine.Desc
    | VariableDefine.Desc[]
    | ((returnType: WithDynamicVariable) => string | undefined)
  disabled?: boolean
}

const props = defineProps<Props>()
const hasError = ref(false)
const errorText = ref('')
const showExpand = ref(false)
const codeRef = ref('')
const wrapperRef = ref<HTMLDivElement>()
const { render } = useRender()

const handleChangeAst = (astInfo: AstInfo) => {
  let _hasError = false
  if (astInfo.error && codeRef.value) {
    errorText.value = astInfo.error.syntaxError.msg
    _hasError = true
  }

  if (props.accept && astInfo.typeMap) {
    const returnType = astInfo.typeMap.get(astInfo.ast.syntaxRootIds?.[0] || '')
    if (returnType) {
      if (props.accept instanceof Array) {
        if (
          props.accept.every(
            (item) => !variableCanAcceptFormula(item, returnType),
          )
        ) {
          errorText.value = `当前公式仅接受 ${props.accept.map((item) => item.type).join('、')} 类型的值`
          _hasError = true
        }
      } else if (typeof props.accept === 'function') {
        const acceptMsg = props.accept(returnType)
        if (acceptMsg) {
          errorText.value = acceptMsg
          _hasError = true
        }
      } else {
        if (!variableCanAcceptFormula(props.accept, returnType)) {
          errorText.value = `当前公式仅接受 ${props.accept.type} 类型的值`
          _hasError = true
        }
      }
    }
  }

  if (!_hasError) {
    errorText.value = ''
  }
  hasError.value = _hasError
}

const handleChangeToken = (tokenInfo: TokenInfo) => {
  codeRef.value = tokenInfo.code
}

const handleShowExpand = () => {
  if (wrapperRef.value) {
    const height = wrapperRef.value.offsetHeight
    wrapperRef.value.setAttribute('style', `height: ${height}px`)
  }
  showExpand.value = true
}

const handleHiddenExpand = () => {
  const editorWrapper = wrapperRef.value?.firstChild as HTMLDivElement | null
  if (editorWrapper) {
    render.mount(editorWrapper)
    wrapperRef.value?.removeAttribute('style')
  }

  showExpand.value = false
}
</script>

<style lang="scss">
.variable-editor-wrapper {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  .editor-wrapper {
    padding-right: 1.5rem;
  }
  .variable-editor-expand-icon {
    position: absolute;
    top: calc(50% + 1px);
    right: 0;
    transform: translate(-0.2rem, -50%);
    border-radius: 4px;
    padding: 4px 2px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}

.variable-editor-modal.el-dialog {
  .variable-render-error {
    padding: 0.4rem 1rem;
    color: red;
    word-break: break-all;
  }

  .variable-editor {
    height: 120px;
    .editor-wrapper {
      align-items: flex-start;
      align-content: flex-start;
    }
  }
}

.variable-editor {
  & > .editor-wrapper {
    cursor: text;
    overflow: auto;
    border-radius: 4px;
  }

  &.has-error {
    & > .editor-wrapper {
      outline: 1px solid red;
    }
  }

  &.is-disabled > .editor-wrapper {
    cursor: not-allowed;
  }
}
</style>
