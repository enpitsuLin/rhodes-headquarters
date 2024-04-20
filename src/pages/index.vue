<script setup lang="ts">
import { useAccounts, useBindings, useCurrentAccount } from '@/composables/account'
import { currentChararcterUidStorage } from '@/store/account'
import { chararcterStorage } from '@/store/info'
import BaseStatus from '~/components/BaseStatus.vue'
import CharacterSwitcher from '~/components/CharacterSwitcher.vue'
import MissionStat from '~/components/MissionStat.vue'
import PopupFooter from '~/components/PopupFooter.vue'
import RhodesIslandManage from '~/components/RhodesIslandManage.vue'
import Button from '~/components/ui/button/index.vue'

const accounts = useAccounts()
const currentAccount = useCurrentAccount()
const characters = useBindings(currentAccount)
const characterInfo = useWxtStorage(chararcterStorage)
const currentUid = useWxtStorage(currentChararcterUidStorage)

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main
    class="skland-container" relative c-foreground p-2 w-350px h-600px backdrop="blur-5px dark:blur-unset"
    flex="~ col"
  >
    <template v-if="accounts.length === 0">
      <div py-4>
        <h2 text-xl>
          暂无账号
        </h2>
        <span>No Account</span>
      </div>
      <Button variant="animate-outline" data-testid="option-button" @click="openOptionsPage">
        <span>前去添加</span>
        <svg
          stroke="current" w-16 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 18"
        >
          <path d="M6 13 h35 l-6 -6" fill="none" />
        </svg>
      </Button>
    </template>
    <template v-else-if="currentAccount">
      <CharacterSwitcher
        v-model:uid="currentUid"
        :status="characterInfo?.status ?? currentAccount.gameStatus"
        :characters="characters"
      />
      <BaseStatus :status="currentAccount.gameStatus" />
      <RhodesIslandManage />
      <MissionStat
        :account="currentAccount"
        :uid="currentUid"
      />
      <PopupFooter />
    </template>
  </main>
</template>
