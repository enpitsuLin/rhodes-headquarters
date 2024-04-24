<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { useMagicKeys } from '@vueuse/core'
import { useAccounts, useCurrentAccount } from '@/composables/account'
import LayoutDefault from '~/components/layouts/default.vue'
import SectionSanity from '~/components/home/SectionSanity.vue'
import SectionRecruit from '~/components/home/SectionRecruit.vue'
import { chararcterStorage } from '@/store/info'
import SectionMission from '@/components/home/SectionMission.vue'
import SectionTip from '@/components/home/SectionTip.vue'
import SectionCharacter from '@/components/home/SectionCharacter.vue'

const router = useRouter()
const accounts = useAccounts()
const currentAccount = useCurrentAccount()

const characterInfo = useWxtStorage(chararcterStorage)

const { meta, control } = useMagicKeys()

function onOptionClick() {
  // TODO 确定一下 PC 上 control 键，可以判断环境再判断键位
  if (meta.value || control.value)
    browser.runtime.openOptionsPage()
  else router.push('/options')
}
</script>

<template>
  <LayoutDefault>
    <template v-if="accounts.length === 0">
      <h2>TODO</h2>
      <button @click="onOptionClick">
        router
      </button>
    </template>
    <template v-else-if="currentAccount">
      <SectionCharacter :status="characterInfo?.status ?? currentAccount.gameStatus" />
      <SectionSanity :status="characterInfo?.status ?? currentAccount.gameStatus" />
      <SectionRecruit
        v-if="characterInfo"
        :recruits="characterInfo.recruit"
        :hire="characterInfo.building.hire"
      />
      <SectionMission />
      <SectionTip />
    </template>
  </LayoutDefault>
</template>
