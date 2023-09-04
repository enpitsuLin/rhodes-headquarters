<script setup lang="ts">
import * as hoverCard from '@zag-js/hover-card'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

const [state, send] = useMachine(hoverCard.machine({ id: 'popup-footer', openDelay: 0, closeDelay: 100 }))

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <footer flex="~ justify-end">
    <button v-bind="api.triggerProps" cursor-help>
      <div i-ri:question-fill h-4 w-4 />
    </button>
  </footer>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="op-0"
      leave-to-class="op-0"
    >
      <div v-if="api.isOpen" v-bind="api.positionerProps">
        <div v-bind="api.contentProps" p-2 class="bg-main" border="~ rounded">
          <div v-bind="api.arrowProps">
            <div v-bind="api.arrowTipProps" />
          </div>
          <p>TIP:查询结果可能与游戏内数据存在一部分延迟</p>
          <p>具体请以游戏内数据为准</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
