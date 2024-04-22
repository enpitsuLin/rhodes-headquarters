<script setup lang="ts">
import AccountItem from '@/components/account/AccountItem.vue'
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
      <button
        type="button"
        shadow shadow-black:50
        absolute right-24px bottom-24px
        size-50px rounded-full bg="#35373c"
      >
        <div
          absolute left-5px top-5px
          size-40px bg="#494b50" rounded-full
          flex="inline items-center justify-center"
        >
          <div c="white hover:primary" transition-color>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 0H9V9H0V11H9V20H11V11H20V9H11V0Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </button>
    </template>
  </OptionLayout>
</template>
