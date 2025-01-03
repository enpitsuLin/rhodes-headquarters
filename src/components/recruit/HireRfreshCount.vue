<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '~/store/account'

const { info } = storeToRefs(useAccountsStore())

const hire = computed(() => info.value!.building.hire)
</script>

<template>
  <div
    border="b border"
    p-4px flex="~ items-center gap-8px"
  >
    <template v-if="hire">
      联络次数 {{ hire?.refreshCount }}/3
    </template>
    <template v-else>
      公招功能可能尚未解锁
    </template>
  </div>
</template>
