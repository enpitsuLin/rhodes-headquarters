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
import Loading from '@/components/Loading.vue'

const router = useRouter()
const accounts = useAccounts()
const currentAccount = useCurrentAccount()

const characterInfo = useWxtStorage(chararcterStorage)

const { meta, control } = useMagicKeys()

function onOptionClick() {
  // TODO 确定一下 PC 上 control 键，可以判断环境再判断键位
  if (meta.value || control.value) {
    browser.tabs.create({
      url: browser.runtime.getURL('/options.html?to=preferences'),
    })
  }
  else { router.push('/options') }
}
</script>

<template>
  <LayoutDefault>
    <template v-if="accounts.length === 0">
      <h2>
        TODO
      </h2>
      <div absolute bottom-6 left-0 right-0 flex="~ justify-center">
        <Loading as="button" type="button" @click="onOptionClick">
          <svg size-20px c-primary width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14H4V18H14V28H18V18H28V14H18V4H14V14Z" fill="currentColor" />
          </svg>
        </Loading>
      </div>
    </template>
    <template v-else-if="currentAccount">
      <SectionCharacter :status="characterInfo?.status ?? currentAccount.gameStatus" />
      <SectionSanity v-if="characterInfo" :status="characterInfo?.status " />
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
