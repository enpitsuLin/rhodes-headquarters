<script setup lang="ts">
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import Recruit from './Recruit.vue'
import { chararcterStorage } from '@/store/info'

const characterInfo = useWxtStorage(chararcterStorage)

const data = [{ id: 'recruitment', label: '公招' }, { id: 'building', label: '基建' }]

const [state, send] = useMachine(tabs.machine({ id: 'rhodes-island-manage', value: 'recruitment' }))
const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-if="characterInfo" flex-1 flex="~ col">
    <nav flex="~ items-center">
      <header flex-1 c-foreground flex="~ items-end gap-2">
        <h2 text-2xl>
          罗德岛
        </h2>
        <div>Rhodes Island</div>
      </header>
      <ul px-2>
        <li v-for="item in data" :key="item.id" inline-block cursor-pointer>
          <button
            v-bind="api.getTriggerProps({ value: item.id })"
            block relative px-2 py-3 mx-1 font-bold
            c="foreground hover:primary"
            border="b-4px [&.active]:b-primary"
            transition="all duration-300"
            :class="[api.value === item.id && 'active']"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>
    <div role="separator" relative border="b white">
      <div left-0 absolute w-5px h-5px bg-white top="-2px" />
      <div right-0 absolute w-5px h-5px bg-white top="-2px" />
    </div>
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease"
      leave-active-class="transition-all duration-300 ease"
      enter-from-class="op-0 -translate-x-full"
      leave-to-class="op-0 -translate-x-full"
      tag="div"
      aria-label="container"
      of-hidden p-2 flex-1
    >
      <div v-for="item in data" v-show="api.value === item.id" v-bind="api.getContentProps({ value: item.id })" :key="item.id" h-220px>
        <Recruit
          v-if="item.id === 'recruitment'"
          :recruits="characterInfo?.recruit ?? []"
          :hire="characterInfo?.building.hire"
        />

        <div v-if="item.id === 'building'">
          基建信息 TODO
        </div>
      </div>
    </TransitionGroup>
    <div role="separator" relative border="b white">
      <div left-0 absolute w-5px h-5px bg-white top="-2px" />
      <div right-0 absolute w-5px h-5px bg-white top="-2px" />
    </div>
  </div>
</template>
