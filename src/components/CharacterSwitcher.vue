<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import Avatar from '~/components/Avatar.vue'
import type { BindingRole, Status } from '~/types'

defineProps<{ uid: string, status: Status, characters: BindingRole[] }>()
const emit = defineEmits<{
  (event: 'update:uid', id: string): void
}>()

const [state, send] = useMachine(
  menu.machine({
    'id': 'menu',
    'aria-label': 'Role',
    onSelect({ value }) {
      emit('update:uid', value)
    },
  }),
)

const api = computed(() => menu.connect(state.value, send, normalizeProps))

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div
    py-2 flex="~ items-center justify-between"
    transition="colors duration-300"
  >
    <div flex-1 p-1 flex="~ items-center gap-2">
      <Avatar :avatar="status.avatar" :name="status.name" />
      <div flex-1 flex="~ col justify-between">
        <h3 text-lg>
          {{ status.name }}
        </h3>
        <div flex="~ gap-2">
          <div>
            Lv.{{ status.level }}
          </div>
          <div>
            UID:{{ status.uid }}
          </div>
        </div>
      </div>
    </div>
    <button
      v-bind="api.triggerProps"
      hover="bg-white/10"
      mx-1
      p-1 rounded-full outline-none flex="inline items-center"
    >
      <div i-ri:more-2-fill w-6 h-6 aria-hidden="true" />
    </button>
  </div>
  <Teleport to="body">
    <div v-bind="api.positionerProps" bg-black c-white>
      <div v-bind="api.contentProps" border="~ white/20" py-2 outline-none min-w-60>
        <button
          v-for="role in characters"
          :key="role.uid"
          type="button"
          v-bind="api.getItemProps({ value: role.uid })"
          flex="~ items-center" px-3 py-2
          outline-none w-full text-left
          transition="colors ease-in-out duration-300"
          bg="hover:primary/50"
        >
          <div>
            <div text-base font-bold>
              {{ role.nickName }}
            </div>
            <div c-foreground:50>
              UID:{{ role.uid }}
            </div>
          </div>
          <div flex-auto />
          <div v-if="uid === role.uid" i-ri-check-line c-primary text-2xl />
        </button>
        <div border="t b-white/20" pt-2>
          <button
            type="button"
            outline-none w-full px-3 py-2
            transition="colors ease-in-out duration-300"
            bg="hover:primary/50" text-left
            flex="~ gap-3 items-center"

            @click="openOptionsPage"
          >
            <div i-ri:settings-3-fill text-xl />
            <div text-sm>
              设置
            </div>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
