<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AccountItem from '~/components/account/AccountItem.vue'
import AddAccountFab from '~/components/account/AddAccountFab.vue'
import { useArknightRole } from '~/store/account'
import OptionLayout from '~/components/layouts/options.vue'

const { roles } = storeToRefs(useArknightRole())
</script>

<template>
  <OptionLayout
    title="账户管理"
    background-title="Account Manage"
  >
    <ul flex="~ col gap-2">
      <li v-for="account in roles" :key="account.uid">
        <AccountItem
          :account="account"
        />
      </li>
    </ul>

    <template #fab>
      <AddAccountFab />
    </template>
  </OptionLayout>
</template>
