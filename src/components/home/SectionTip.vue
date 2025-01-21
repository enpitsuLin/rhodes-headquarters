<script setup lang="ts">
import { Tooltip } from '@ark-ui/vue'
import { useMutation } from '@pinia/colada'
import { fromUnixTime } from 'date-fns'
import { storeToRefs } from 'pinia'
import { sendMessage } from 'webext-bridge/popup'
import { useAccountsStore } from '~/store/account'

const accountsStore = useAccountsStore()
const { currentAccount, currentUid, info } = storeToRefs(accountsStore)

const {
  mutate,
  isLoading,
} = useMutation({
  async mutation(data: { cred: string, uid: string }) {
    const res = await sendMessage(
      'api:skland:get-binding-info',
      data,
    )

    return res
  },
  onSuccess(data, vars) {
    accountsStore.setInfoMapping(vars.uid, data)
  },
})

const updateTime = computed(() => {
  if (!info.value?.currentTs)
    return new Date(1900, 0)

  return fromUnixTime(info.value?.currentTs)
})

function refreshInfo() {
  if (!currentAccount.value || !currentUid.value)
    return

  mutate({
    cred: currentAccount.value.cred,
    uid: currentUid.value,
  })
}
</script>

<template>
  <footer flex="~ gap-2 justify-end">
    <Tooltip.Root :positioning="{ placement: 'top-end' }">
      <Tooltip.Trigger
        rounded-md bg="hover:border/50" p="x-1 y-0.5"
        class="active:scale-95"
        @click="refreshInfo"
      >
        <div
          class="size-14px"
          :class="{
            'animate-spin i-carbon-fade': isLoading,
            'i-carbon-cloud-download': !isLoading,
          }"
        />
      </Tooltip.Trigger>
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-500"
          leave-active-class="transition-opacity duration-500"
          enter-from-class="op-0"
          leave-to-class="op-0"
        >
          <Tooltip.Positioner>
            <Tooltip.Content
              relative
              bg-background p-2 border="~ border/30"
              animate="data-[state=closed]:(out duration-200 fade-out) data-[state=open]:(in duration-200 fade-in)"
            >
              立即更新
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Transition>
      </Teleport>
    </Tooltip.Root>
    <Tooltip.Root :positioning="{ placement: 'top-end' }">
      <Tooltip.Trigger
        rounded-md bg="hover:border/50" p="x-1 y-0.5"
        class="active:scale-95"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z" fill="white" />
          <path d="M4.59812 5.06275C4.59692 5.09101 4.60151 5.11921 4.61162 5.14563C4.62172 5.17204 4.63713 5.19611 4.65688 5.21636C4.67663 5.2366 4.70031 5.25259 4.72647 5.26334C4.75263 5.27409 4.78071 5.27938 4.80899 5.27887H5.53087C5.65162 5.27887 5.74787 5.18 5.76362 5.06012C5.84237 4.48612 6.23612 4.06788 6.93787 4.06788C7.53812 4.06788 8.08762 4.368 8.08762 5.08987C8.08762 5.6455 7.76037 5.901 7.24324 6.2895C6.65437 6.71738 6.18799 7.217 6.22124 8.02813L6.22387 8.218C6.22479 8.27541 6.24824 8.33015 6.28916 8.37042C6.33009 8.41069 6.3852 8.43326 6.44262 8.43325H7.15224C7.21026 8.43325 7.2659 8.4102 7.30692 8.36918C7.34795 8.32816 7.37099 8.27252 7.37099 8.2145V8.12262C7.37099 7.49438 7.60987 7.3115 8.25474 6.82237C8.78762 6.41725 9.34324 5.9675 9.34324 5.02338C9.34324 3.70125 8.22674 3.0625 7.00437 3.0625C5.89574 3.0625 4.68124 3.57875 4.59812 5.06275ZM5.96049 10.1054C5.96049 10.5717 6.33237 10.9165 6.84424 10.9165C7.37712 10.9165 7.74374 10.5717 7.74374 10.1054C7.74374 9.62238 7.37624 9.28288 6.84337 9.28288C6.33237 9.28288 5.96049 9.62238 5.96049 10.1054Z" fill="white" />
        </svg>
      </Tooltip.Trigger>
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-500"
          leave-active-class="transition-opacity duration-500"
          enter-from-class="op-0"
          leave-to-class="op-0"
        >
          <Tooltip.Positioner>
            <Tooltip.Content
              relative
              bg-background p-2 border="~ border/30"
              animate="data-[state=closed]:(out duration-200 fade-out) data-[state=open]:(in duration-200 fade-in)"
            >
              <p>
                <span>数据更新于:</span>
                <time :datetime="updateTime.toISOString()">
                  {{ updateTime.toLocaleString() }}
                </time>
              </p>
              <p>TIP:查询结果可能与游戏内数据存在延迟</p>
              <p>具体请以游戏内数据为准</p>
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Transition>
      </Teleport>
    </Tooltip.Root>
  </footer>
</template>
