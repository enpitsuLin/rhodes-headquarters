<script setup lang="ts">
import { QrCode } from '@ark-ui/vue/qr-code'
import { useMutation, useQuery } from '@pinia/colada'
import { useElementVisibility, useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/popup'
import { useSkalandSignIn } from '~/composables/mutations/skland'

const emit = defineEmits<{ close: [] }>()

const main = ref<HTMLElement | null>(null)
const toast = useToast()

const isVisible = useElementVisibility(main)

const { data, isLoading, refetch: refreshScanUrl } = useQuery({
  key: ['genScanLoginUrl'],
  async query() {
    return sendMessage('api:hypergrayph:gen-scan-login-url', undefined)
  },
  enabled: isVisible,
  refetchOnWindowFocus: false,
})

const { pause, resume } = useIntervalFn(
  intervalMutate,
  1200,
  { immediate: false },
)

useIntersectionObserver(
  main,
  ([entry]) => {
    if (!entry?.isIntersecting) {
      pause()
    }
  },
)

const {
  mutate: mutateSignIn,
} = useSkalandSignIn({
  onSuccess() {
    toast.create({ title: '新增成功' })
    emit('close')
  },
})

const { mutate: mutateGetTokenByScanCode } = useMutation({
  key: () => ['getTokenByScanCode'],
  async mutation(scanCode: string) {
    return sendMessage('api:hypergrayph:get-oauth-token-by-scan-code', scanCode)
  },
  onSuccess(data) {
    mutateSignIn(data)
  },
})

const { data: scanStatus, mutate } = useMutation({
  key: () => ['getScanStatus', String(data.value?.scanId)],
  async mutation() {
    return sendMessage('api:hypergrayph:get-scan-status', data.value!.scanId)
  },
  onSuccess(data) {
    if (['已扫码待确认', '已失效', '未扫码'].includes(data.msg)) {
      return
    }
    if (data.data.scanCode) {
      pause()
      mutateGetTokenByScanCode(data.data.scanCode)
    }
  },
})

function intervalMutate() {
  mutate()
}

watch(data, () => {
  if (data.value?.scanId) {
    resume()
  }
})
</script>

<template>
  <main ref="main">
    <div v-if="isLoading" flex="~ col items-center justify-center" size-150px>
      <div size-100px class="i-carbon:fade animate-spin" />
    </div>
    <template v-else-if="data?.scanUrl">
      <QrCode.Root :value="data.scanUrl" size-150px>
        <QrCode.Frame>
          <QrCode.Pattern fill-white />
        </QrCode.Frame>
        <QrCode.Overlay
          v-if="scanStatus?.msg === '已扫码待确认'"
          bg-background:40
          flex="~ col items-center justify-center gap-2px"
          class="backdrop-blur-2px [translate:unset]! inset-0!"
        >
          <div size-10 class="i-carbon:checkmark-filled" />
          <div text-base>
            扫码成功
          </div>
          <div>请在手机上确认登录</div>
        </QrCode.Overlay>
        <QrCode.Overlay
          v-else-if="scanStatus?.msg === '已失效'"

          flex="~ col items-center justify-center gap-2px"
          class="backdrop-blur-2px [translate:unset]! inset-0!"
          as-child bg-background:40
        >
          <button type="button" @click="() => refreshScanUrl()">
            <div size-10 class="i-carbon:update-now" />
            <div text-base>
              二维码已失效
            </div>
            <div>点击刷新</div>
          </button>
        </QrCode.Overlay>
      </QrCode.Root>
    </template>
  </main>
</template>
