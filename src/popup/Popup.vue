<script setup lang="ts">
import { currentUser, useUserInfo } from '~/composables/skland'

const uid = ref('')

const cred = computed(() => currentUser.value?.cred ?? '')

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
</script>

<template>
  <main
    class="skland-container"
    bg="[url(/assets/popup-bg.jpg)] cover center-bottom"
    c-foreground p-2 w-350px
  >
    <div v-if="userInfo">
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
    </div>
    <PopupFooter />
  </main>
</template>
