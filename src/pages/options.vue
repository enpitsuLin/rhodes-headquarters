<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AccountItem from '~/components/account/AccountItem.vue'
import { useAccountsStore } from '~/store/account'

definePage({
  meta: {
    layout: 'options',
    title: '账户管理',
    backgroundTitle: 'Account Manage',
    contentClass: 'bg-secondary-background',
  },
})

const { characters } = storeToRefs(useAccountsStore())
</script>

<template>
  <ul flex="~ col gap-2">
    <li v-for="character in characters" :key="character.uid">
      <AccountItem :account="character" />
    </li>
  </ul>
</template>
