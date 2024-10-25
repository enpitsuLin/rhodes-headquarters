<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AccountItem from '~/components/account/AccountItem.vue'
import AddAccountFab from '~/components/account/AddAccountFab.vue'
import { useAccountsStore } from '~/store/account'
import OptionLayout from '~/components/layouts/options.vue'

const { characters } = storeToRefs(useAccountsStore())
</script>

<template>
  <OptionLayout
    title="账户管理"
    background-title="Account Manage"
  >
    <ul flex="~ col gap-2">
      <li v-for="character in characters" :key="character.uid">
        <AccountItem :account="character" />
      </li>
    </ul>

    <template #fab>
      <AddAccountFab />
    </template>
  </OptionLayout>
</template>
