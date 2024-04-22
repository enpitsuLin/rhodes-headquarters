<script setup lang="ts">
import AccountItem from '@/components/account/AccountItem.vue'
import AddAccountFab from '@/components/account/AddAccountFab.vue'
import OptionLayout from '~/components/layouts/options.vue'

const accounts = useAccounts()
const currentAccount = useCurrentAccount()
</script>

<template>
  <OptionLayout
    title="账户管理"
    background-title="Account Manage"
  >
    <ul flex="~ col gap-2">
      <li v-for="account in accounts" :key="account.id">
        <AccountItem
          :account="account"
          :current="account.id === currentAccount?.id"
        />
      </li>
    </ul>
    <template #fab>
      <AddAccountFab />
    </template>
  </OptionLayout>
</template>
