<script setup lang="ts">
import { useAccountsStore } from '~/store/account'
import Avatar from '~/components/Avatar.vue'
import type { ArknightRole } from '~/composables/storages'

const { account } = defineProps<{ account: ArknightRole }>()

const accountStore = useAccountsStore()

const status = computed(() => {
  return accountStore.infoMapping?.[account.uid]?.status
})
</script>

<template>
  <section bg="list-item" relative h-70px p-10px>
    <div absolute right-0 top-0 z-0>
      <svg width="125" height="70" viewBox="0 0 125 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_59_256)">
          <mask id="mask0_59_256" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="-4" width="131" height="78">
            <path d="M0.431641 -3.88892L130.859 -3.88892V73.8889L0.431641 73.8889V-3.88892Z" fill="white" />
          </mask>
          <g mask="url(#mask0_59_256)">
            <g opacity="0.35">
              <path d="M91.8791 73.8889L130.859 34.9181L91.8791 -3.88892L52.8988 34.9181L91.8791 73.8889ZM112.274 34.9181L91.8791 55.2222L71.4844 34.9181L91.8791 14.614L112.274 34.9181Z" fill="#43464C" />
              <path opacity="0.8" d="M60.959 69.1404L70.1695 59.9707L45.1695 34.9181L70.1695 10.0293L60.959 0.695923L26.584 34.9181L60.959 69.1404Z" fill="#43464C" />
              <path opacity="0.6" d="M34.8068 69.1404L44.1818 59.9707L19.0174 34.9181L44.1818 10.0293L34.8068 0.695923L0.43182 34.9181L34.8068 69.1404Z" fill="#43464C" />
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="clip0_59_256">
            <rect width="125" height="70" fill="white" transform="matrix(-1 0 0 1 125 0)" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div relative flex="~ gap-1 items-center">
      <Avatar v-if="status?.avatar" :avatar="status?.avatar" />
      <div flex="~ col 1">
        <div text-base font-bold>
          {{ account.nickName }}
        </div>
        <div text-xs op-60>
          UID: {{ account.uid }}
        </div>
      </div>
      <div flex="~ justify-end gap-1">
        <button
          v-if="accountStore.currentUid !== account.uid"
          type="button"
          p="x-1 y-1px"
          bg="white hover:primary" c="black hover:white"
          transition-colors
          @click="accountStore.setCurrentUid(account.uid)"
        >
          设为默认
        </button>
        <button
          type="button"
          flex="inline items-center justify-center"
          size-24px c="white hover:primary"
          transition-colors
          @click="accountStore.removeRole(account.uid)"
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18C2.45 18 1.97934 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3C0.71667 3 0.479337 2.904 0.288004 2.712C0.0966702 2.52 0.000670115 2.28267 3.44827e-06 2C-0.000663218 1.71733 0.0953369 1.48 0.288004 1.288C0.48067 1.096 0.718003 1 1 1H5C5 0.716667 5.096 0.479333 5.288 0.288C5.48 0.0966668 5.71734 0.000666667 6 0H10C10.2833 0 10.521 0.0960001 10.713 0.288C10.905 0.48 11.0007 0.717333 11 1H15C15.2833 1 15.521 1.096 15.713 1.288C15.905 1.48 16.0007 1.71733 16 2C15.9993 2.28267 15.9033 2.52033 15.712 2.713C15.5207 2.90567 15.2833 3.00133 15 3V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM6 14C6.28334 14 6.521 13.904 6.713 13.712C6.905 13.52 7.00067 13.2827 7 13V6C7 5.71667 6.904 5.47933 6.712 5.288C6.52 5.09667 6.28267 5.00067 6 5C5.71734 4.99933 5.48 5.09533 5.288 5.288C5.096 5.48067 5 5.718 5 6V13C5 13.2833 5.096 13.521 5.288 13.713C5.48 13.905 5.71734 14.0007 6 14ZM10 14C10.2833 14 10.521 13.904 10.713 13.712C10.905 13.52 11.0007 13.2827 11 13V6C11 5.71667 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 10 5C9.71734 4.99933 9.48 5.09533 9.288 5.288C9.096 5.48067 9 5.718 9 6V13C9 13.2833 9.096 13.521 9.288 13.713C9.48 13.905 9.71734 14.0007 10 14Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
