<template>
  <div class="formula-operator-wrapper">
    <div
      v-for="group in tokenOptionsWithGroup"
      :key="group.id"
      class="formula-operator-group"
    >
      <div class="formula-operator-group-title">
        <DownOutlined
          class="icon-down"
          :style="closeIds.includes(group.id) ? 'rotate: -90deg' : undefined"
          @click="() => handleToggle(group.id)"
        />
        <span>{{ group.groupLabel }}</span>
      </div>
      <div
        v-if="!closeIds.includes(group.id)"
        class="formula-operator-group-content"
      >
        <div
          v-for="token in group.tokens"
          :key="token.value"
          class="formula-operator-group-token"
          @click="() => emit('pickOperator', token.value)"
        >
          {{ token.value }}({{ token.label }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DownOutlined from '../../../components/downOutlined.vue'

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

const emit = defineEmits<{
  (e: 'pickOperator', token: string): void
}>()
const closeIds = ref<string[]>([])

const handleToggle = (groupId: string) => {
  if (closeIds.value.includes(groupId)) {
    closeIds.value = closeIds.value.filter((item) => item !== groupId)
    return
  }

  closeIds.value = [...closeIds.value, groupId]
}
</script>
