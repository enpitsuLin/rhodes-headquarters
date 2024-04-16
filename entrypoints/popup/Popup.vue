<script setup lang="ts">
import { useStyleTag } from '@vueuse/core'
import BaseStatus from '~/components/BaseStatus.vue'
import CharacterSwitcher from '~/components/CharacterSwitcher.vue'
import MissionStat from '~/components/MissionStat.vue'
import PopupFooter from '~/components/PopupFooter.vue'
import RhodesIslandManage from '~/components/RhodesIslandManage.vue'
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import { currentUser, useUserInfo } from '~/composables/skland'
import Button from '~/components/ui/button/index.vue'

const uid = ref('')

const cred = computed(() => currentUser.value?.grant_code ?? '')

const arknightsBinding = computed(() => currentUser.value?.binding.filter(i => i.appCode === 'arknights').map(i => i.bindingList).flat() ?? [])

const { data: userInfo, execute } = useUserInfo(cred, uid)

watch(arknightsBinding, (binding) => {
  if (binding.length === 1)
    uid.value = binding[0].uid
}, { immediate: true })

watch(uid, (uid, oldUid) => {
  if (uid !== '' && cred.value !== '' && uid !== oldUid)
    execute()
}, { immediate: true })

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main
    class="skland-container"
    relative c-foreground p-2 w-350px h-600px
    backdrop="blur-5px dark:blur-unset"
    flex="~ col"
  >
    <template v-if="arknightsBinding.length === 0">
      <div py-4>
        <h2 text-xl>
          暂无账号
        </h2>
        <span>No Account</span>
      </div>
      <Button variant="animate-outline" @click="openOptionsPage">
        <span>前去添加</span>
        <svg stroke="current" w-16 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 18"><path d="M6 13 h35 l-6 -6" fill="none" /></svg>
      </Button>
    </template>
    <template v-if="userInfo">
      <CharacterSwitcher
        v-model:uid="uid"
        :status="userInfo?.data.status"
        :characters="arknightsBinding"
      />
      <BaseStatus :status="userInfo.data.status" />

      <RhodesIslandManage :player="userInfo.data" />

      <MissionStat
        :campaign="userInfo.data.campaign"
        :tower="userInfo.data.tower"
        :routine="userInfo.data.routine"
      />
      <PopupFooter />
    </template>
    <DustBackground />
  </main>
  <Cursor />
</template>
