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

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main
    class="skland-container"
    bg="[url(/assets/popup-bg.jpg)] cover center-bottom"
    c-foreground p-2 w-350px h-600px
    flex="~ col"
  >
    <template v-if="arknightsBinding.length === 0">
      <div py-4>
        <h2 text-xl>
          暂无账号
        </h2>
        <span>No Account</span>
      </div>
      <button
        outline-none relative flex="~ items-center"
        p="x2 y1"
        c="#ababab hover:primary"
        class="group"
        @click="openOptionsPage"
      >
        <div
          absolute top-0 left-0
          h="20% group-hover:50%" w-full
          border="~ #ababab b-0 group-hover:primary"
          transition="all duration-150"
        />
        <span text-sm>前去添加</span>
        <svg stroke="#ababab" w-16 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 18"><path d="M6 13 h35 l-6 -6" fill="none" /></svg>
        <div
          absolute bottom-0 left-0
          h="20% group-hover:50%" w-full
          border="~ #ababab t-0 group-hover:primary"
          transition="all duration-150"
        />
      </button>
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
  </main>
</template>
