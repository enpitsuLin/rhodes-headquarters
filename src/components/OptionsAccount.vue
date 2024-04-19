<script setup lang="ts">
import type { Account } from '@/store/account'

defineProps<{ account: Account }>()

defineEmits<{
  setCurrent: [id: string]
  logOut: [id: string] // named tuple syntax
}>()

const currentAccount = useCurrentAccount()
</script>

<template>
  <div
    p-2.5 items-center
    flex="~ justify-between gap-2"
    border="~ border"
    mt="-1px"
  >
    <div relative w-10 h-10 rounded-lg of-hidden bg-white>
      <img :src="account.user.avatar">
    </div>
    <div text-left flex-1>
      {{ account.user.nickname }}
      <div
        v-if="currentAccount?.id === account.id"
        inline-block text-xs
        border="~ border"
        p-1 scale="80"
      >
        默认
      </div>
    </div>
    <Button
      v-if="currentAccount?.id !== account.id"
      class="text-12px px-4 h-6"
      size="unset"
      @click="$emit('setCurrent', account.id)"
    >
      设为默认
    </Button>
    <Button
      class="text-xs h-6 w-6"
      size="unset"
      @click="$emit('logOut', account.id)"
    >
      <div i-ri:close-fill />
    </Button>
  </div>
</template>
