<script setup lang="ts">
import {
  bindingArknightRoles,
  currentUid,
  roleInfo,
  useArknightRoleInfo,
} from '@/composables/arknights'
import BaseStatus from '~/components/BaseStatus.vue'
import CharacterSwitcher from '~/components/CharacterSwitcher.vue'
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import MissionStat from '~/components/MissionStat.vue'
import PopupFooter from '~/components/PopupFooter.vue'
import RhodesIslandManage from '~/components/RhodesIslandManage.vue'
import Button from '~/components/ui/button/index.vue'
import { currentUser } from '~/composables/skland'

const cred = computed(() => currentUser.value?.cred ?? '')

const execute = useArknightRoleInfo()

watch(currentUid, (uid, oldUid) => {
  if (uid !== '' && cred.value !== '' && uid !== oldUid)
    execute()
}, { immediate: true })

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const users = useUsers()
defineExpose({ users })
</script>

<template>
  <main
    class="skland-container" relative c-foreground p-2 w-350px h-600px backdrop="blur-5px dark:blur-unset"
    flex="~ col"
  >
    <template v-if="bindingArknightRoles.length === 0">
      <div py-4>
        <h2 text-xl>
          暂无账号
        </h2>
        <span>No Account</span>
      </div>
      <Button variant="animate-outline" @click="openOptionsPage">
        <span>前去添加</span>
        <svg
          stroke="current" w-16 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 18"
        >
          <path d="M6 13 h35 l-6 -6" fill="none" />
        </svg>
      </Button>
    </template>
    <template v-if="roleInfo">
      <CharacterSwitcher v-model:uid="currentUid" :status="roleInfo?.status" :characters="bindingArknightRoles" />
      <BaseStatus :status="roleInfo.status" />

      <RhodesIslandManage :player="roleInfo" />

      <MissionStat :campaign="roleInfo.campaign" :tower="roleInfo.tower" :routine="roleInfo.routine" />
      <PopupFooter />
    </template>
    <DustBackground />
  </main>
  <Cursor />
</template>
