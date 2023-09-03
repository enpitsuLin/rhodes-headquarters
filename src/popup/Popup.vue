<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { currentUser } from '~/composables/skland'
import { useUserInfo } from '~/composables/user'

const uid = ref('')

const arknightsBinding = currentUser.value?.binding.filter(i => i.appCode === 'arknights').map(i => i.bindingList).flat() ?? []

const { data: userInfo, execute } = useUserInfo(computed(() => currentUser.value?.cred ?? ''), uid)

const [state, send] = useMachine(
  menu.machine({
    'id': 'menu',
    'aria-label': 'Role',
    onSelect({ value }) {
      uid.value = value
      execute()
    },
  }),
)

const api = computed(() => menu.connect(state.value, send, normalizeProps))

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-350px min-h-350px px-4 py-5 bg-main">
    <div py-2 flex="~ items-center justify-between">
      <button v-bind="api.triggerProps" flex="inline items-center">
        <span text-base>选择角色 </span>
        <div i-ri:arrow-drop-down-fill w-4 h-4 aria-hidden="true" />
      </button>
      <button @click="openOptionsPage">
        <div i-ri:settings-line h-4 w-4 />
      </button>
    </div>
    <Teleport to="body">
      <div v-bind="api.positionerProps" bg-black c-white>
        <div v-bind="api.contentProps">
          <ul>
            <li
              v-for="role in arknightsBinding"
              :key="role.uid"
              v-bind="api.getItemProps({ id: role.uid })"
            >
              {{ role.nickName }} uid:{{ role.uid }}
            </li>
          </ul>
        </div>
      </div>
    </Teleport>
    <div v-if="userInfo">
      <BaseStatus :status="userInfo.data.status" />
      <Recruit :recruits="userInfo.data.recruit" :hire="userInfo.data.building.hire" />
    </div>
  </main>
</template>
