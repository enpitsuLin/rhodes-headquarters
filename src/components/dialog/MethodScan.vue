<script setup lang="ts">
import type { ArknightRole, SklandAccount } from '~/composables/storages'
import { QrCode } from '@ark-ui/vue/qr-code'
import { useMutation, useQuery } from '@pinia/colada'
import { useIntervalFn } from '@vueuse/core'
import { generateCredByCode, genScanLoginUrl, getBindingInfo, getOAuthTokenByScanCode, getPlayerBinding, getScanStatus, grantAuthorizeCode } from '~/api'
import { useAccountsStore } from '~/store/account'

const enabled = ref(false)
const accountsStore = useAccountsStore()
const toast = useToast()

const { data, isLoading } = useQuery({
  key: ['genScanLoginUrl'],
  async query() {
    return genScanLoginUrl()
  },
  enabled,
  refetchOnWindowFocus: false,
})

const { pause, resume } = useIntervalFn(
  intervalMutate,
  3000,
  {
    immediate: false,
  },
)

const {
  mutate: mutateSignIn,
} = useMutation({
  async mutation(token: string) {
    if (!token)
      throw new Error('凭证为空')

    const code = await grantAuthorizeCode(token)
    const res = await generateCredByCode(code)
    const binding = await getPlayerBinding(res.cred)

    const account: SklandAccount = {
      id: res.userId,
      cred: res.cred,
    }
    return {
      account,
      bindings: await Promise.all(binding.map(async (b) => {
        const info = await getBindingInfo(res.cred, b.uid)
        const role: ArknightRole = {
          ...b,
          accountId: res.userId,
        }
        return {
          role,
          info,
        }
      })),
    }
  },
  onSuccess(data) {
    accountsStore.addAccount(data.account)
    data.bindings.forEach(({ info, role }) => {
      accountsStore.addRole(role)
      accountsStore.setInfoMapping(role.uid, info)
    })

    if (accountsStore.characters.length === 1)
      accountsStore.setCurrentUid(accountsStore.characters[0].uid)

    toast.create({
      title: '新增成功',
      notification: false,
    })
  },
})

const { mutate: mutateGetTokenByScanCode } = useMutation({
  key: () => ['getTokenByScanCode'],
  async mutation(scanCode: string) {
    return getOAuthTokenByScanCode(scanCode)
  },
  onSuccess(data) {
    mutateSignIn(data)
  },
})

const { mutate } = useMutation({
  key: () => ['getScanStatus', String(data.value?.scanId)],
  async mutation() {
    return getScanStatus(data.value!.scanId)
  },
  onSuccess(data) {
    if (data.msg === '已扫码待确认') {
      return
    }
    if (data.msg === '未扫码') {
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
  <main>
    <button @click="enabled = true">
      激活
    </button>
    <div v-if="isLoading" size-100px>
      loading..
    </div>
    <template v-else-if="data?.scanUrl">
      <QrCode.Root :value="data.scanUrl" size-100px>
        <QrCode.Frame size-100px>
          <QrCode.Pattern fill-white />
        </QrCode.Frame>
      </QrCode.Root>
    </template>
  </main>
</template>
