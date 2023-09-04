<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
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

const [state, send] = useMachine(
  menu.machine({
    'id': 'menu',
    'aria-label': 'Role',
    onSelect({ value }) {
      uid.value = value
    },
  }),
)

const api = computed(() => menu.connect(state.value, send, normalizeProps))

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main
    class="skland-container"
    bg="[url(/assets/popup-bg.jpg)] cover center-bottom"
    c-foreground p-2 w-350px
  >
    <div py-2 flex="~ items-center justify-between">
      <button v-bind="api.triggerProps" outline-none flex="inline items-center">
        <span text-base>选择角色 </span>
        <div i-ri:arrow-drop-down-fill w-4 h-4 aria-hidden="true" />
      </button>
      <button @click="openOptionsPage">
        <div i-ri:settings-line h-4 w-4 />
      </button>
    </div>
    <Teleport to="body">
      <div v-bind="api.positionerProps" bg-black c-white>
        <div v-bind="api.contentProps" border="1 white" py-1>
          <ul space-y-2>
            <li
              v-for="role in arknightsBinding"
              :key="role.uid"
              v-bind="api.getItemProps({ id: role.uid })"
              transition="colors ease-in-out duration-300"
              bg="hover:primary"
            >
              <div relative py-2 px-2 cursor-pointer>
                {{ role.nickName }} uid:{{ role.uid }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Teleport>
    <div v-if="userInfo">
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
