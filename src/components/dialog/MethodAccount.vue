<script setup lang="ts">
import { Field, PinInput } from '@ark-ui/vue'
import { useMutation } from '@pinia/colada'
import { sendMessage } from 'webext-bridge/popup'
import { useSkalandSignIn } from '~/composables/mutations/skland'

const emit = defineEmits<{ close: [] }>()
const toast = useToast()

const phone = ref('')
const otp = ref<string[]>([])
const password = ref('')
const type = ref<'otp' | 'password'>('otp')

const {
  mutate: sendOtp,
  isLoading: otpIsLoading,
  error: otpError,
} = useMutation({
  key: ['send-otp'],
  mutation: async (phone: string) => {
    if (!phone) {
      throw new Error('请输入手机号')
    }
    return sendMessage('api:hypergrayph:send-phone-code', phone)
  },
})

const { mutate, isLoading } = useSkalandSignIn({
  onSuccess() {
    toast.create({ title: '新增成功' })
    phone.value = ''
    otp.value = []
    password.value = ''
    type.value = 'otp'
    emit('close')
  },
})

const {
  mutate: mutateGetOauthTokenByPhoneCode,
} = useMutation({
  key: ['get-oauth-token-by-phone-code'],
  mutation: async (data: { phone: string, code: string }) => {
    return sendMessage('api:hypergrayph:get-oauth-token-by-phone-code', data)
  },
  onSuccess(token) {
    mutate(token)
  },
})

const {
  mutate: mutateGetOauthTokenByPhonePassword,
} = useMutation({
  key: ['get-oauth-token-by-phone-password'],
  mutation: async (data: { phone: string, password: string }) => {
    return sendMessage('api:hypergrayph:get-oauth-token-by-phone-password', data)
  },
  onSuccess(token) {
    mutate(token)
  },
})

function onSubmit() {
  if (type.value === 'otp') {
    mutateGetOauthTokenByPhoneCode({ phone: phone.value, code: otp.value.join('') })
  }
  else {
    mutateGetOauthTokenByPhonePassword({ phone: phone.value, password: password.value })
  }
}
</script>

<template>
  <main>
    <form flex="~ col gap-1" @submit.prevent="onSubmit">
      <Field.Root flex="~ col gap-1" required pb-4>
        <Field.Label>手机号</Field.Label>
        <div
          border="~ border" p="x-4 y-2"
          relative
        >
          <Field.Input
            v-model="phone"
            bg-transparent outline-none
            type="text"
          />
          <button
            v-if="type === 'otp'"
            :disabled="otpIsLoading"
            absolute right-0 type="button" px-2 border="l border"
            @click="() => sendOtp(phone)"
          >
            获取验证码
          </button>
        </div>
        <Field.ErrorText v-if="otpError">
          {{ otpError }}
        </Field.ErrorText>
      </Field.Root>
      <Field.Root v-if="type === 'otp'" flex="~ col gap-1" required pb-4>
        <Field.Label>验证码</Field.Label>

        <PinInput.Root v-model="otp" otp>
          <PinInput.Control flex="~ gap-1.5">
            <PinInput.Input
              v-for="id in [0, 1, 2, 3, 4, 5]" :key="id"
              flex="~ items-center justify-center"
              :index="id"
              border="~ border" size-36px bg-transparent text-center text-base outline-none
            />
          </PinInput.Control>
          <PinInput.HiddenInput />
        </PinInput.Root>
      </Field.Root>
      <Field.Root v-if="type === 'password'" flex="~ col gap-1" required pb-4>
        <Field.Label>密码</Field.Label>
        <Field.Input
          v-model="password"
          border="~ border" p="x-4 y-2"
          relative bg-transparent outline-none
          type="password"
        />
      </Field.Root>
      <button
        :disabled="isLoading"
        h-32px w-250px p-10px
        bg="[url(~/assets/btn-bg.svg)]"
        flex="inline justify-center items-center"
        type="submit"
      >
        提交
      </button>
      <button
        h-32px w-250px p-10px
        border="~ border"
        flex="inline justify-center items-center"
        type="button"
        @click="type = type === 'otp' ? 'password' : 'otp'"
      >
        {{ type === 'otp' ? '账号密码登录' : '验证码登录' }}
      </button>
    </form>
  </main>
</template>
