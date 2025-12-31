<template>
  <ElTabs defaultValue="variable" size="small" class="formula-view-panel-tab">
    <ElTabPane label="变量" name="variable">
      <FormulaVariable
        :variables="render.getOption().variables"
        :getDynamicObjectByPath="render.getOption().getDynamicObjectByPath"
        @select="handleSelectVariable"
      />
    </ElTabPane>
    <ElTabPane label="函数" name="function">
      <FormulaFunction
        :functions="render.getOption().functions"
        @pickFunction="handlePickFunction"
      />
    </ElTabPane>
    <ElTabPane label="运算符" name="operator">
      <Operator @pickOperator="handlePickOperator" />
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { ChangeCursorListener } from '@shuttle-formula/render/src/codeManager/cursor'
import { useRender } from '@shuttle-formula/render-vue'
import { WithLabelFunction } from '@shuttle-formula/functions'

import Operator from './operator.vue'
import FormulaFunction from './function.vue'
import FormulaVariable from './variable.vue'

import 'element-plus/es/components/tabs/style/css'

const { render } = useRender()
const cursorIndexRef = ref(0)

const changeListener: ChangeCursorListener = (event) => {
  if (event.cursorIndex === -1) return

  cursorIndexRef.value = event.cursorIndex
}

onMounted(() => {
  render.codeManager.cursor.addListener(changeListener)
})

onBeforeUnmount(() => {
  render.codeManager.cursor.removeListener(changeListener)
})

const handlePickOperator = (token: string) => {
  render.codeManager.spliceCode(
    cursorIndexRef.value,
    0,
    token,
    true,
    cursorIndexRef.value + token.length,
  )
}

const handlePickFunction = (fnKey: string, fn: WithLabelFunction) => {
  const code = `@${fnKey}()`
  render.codeManager.spliceCode(
    cursorIndexRef.value,
    0,
    code,
    true,
    cursorIndexRef.value + code.length - 1,
  )
}

const handleSelectVariable = (path: string[]) => {
  const code = `$${path.join('.')}`
  render.codeManager.spliceCode(
    cursorIndexRef.value,
    0,
    code,
    true,
    cursorIndexRef.value + code.length,
  )
}
</script>

<style lang="scss">
.formula-view-panel-tab {
  border-top: 1px solid #e5e6eb;
  max-height: calc(60vh - 120px);
  overflow: auto !important;
  .el-tabs__header {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
    margin-bottom: 0;
  }
}

.formula-variable-wrapper {
  width: 100%;
  overflow: auto;
  height: calc(60vh - 190px);
  .cascader-panel-container {
    height: 100%;
  }
}

.formula-function-wrapper {
  display: flex;
  height: calc(60vh - 190px);
  .function-select-wrapper {
    height: 100%;
    max-height: none;
    padding-bottom: 1rem;
    box-sizing: border-box;
  }
  .formula-function-example {
    border-left: 1px solid #e5e6eb;
    flex: 1;
    padding: 0.5rem 1rem 1rem;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }
}

.formula-operator-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0.5rem 0 1rem;
  height: calc(60vh - 190px);
  overflow-y: auto;

  .formula-operator-group-title {
    display: flex;
    align-items: center;
    gap: 6px;
    > :last-child {
      color: #c9cdd4;
      font-size: 0.75rem;
    }
    .icon-down {
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: rotate 0.2s linear;
      &:hover {
        background-color: #e5e6eb;
      }
    }
  }

  .formula-operator-group-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 1.4rem;
    .formula-operator-group-token {
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #e8f3ff;
      }
    }
  }
}
</style>
