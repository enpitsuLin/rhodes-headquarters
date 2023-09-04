<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { currentUser, useUserInfo } from '~/composables/skland'

const uid = ref('')

const arknightsBinding = currentUser.value?.binding.filter(i => i.appCode === 'arknights').map(i => i.bindingList).flat() ?? []

const { data: userInfo, execute } = useUserInfo(computed(() => currentUser.value?.cred ?? ''), uid)

watch(arknightsBinding, (binding) => {
  if (binding.length === 1)
    uid.value = binding[0].uid
}, { immediate: true })

watch(uid, (uid, oldUid) => {
  if (uid !== oldUid)
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
  <main class="w-350px min-h-350px bg-main" p-2>
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
    </div>
  </main>
</template>
