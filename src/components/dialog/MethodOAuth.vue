<script setup lang="ts">
import { FetchError } from 'ofetch'
import { useSkalandSignIn } from '~/composables/mutations/skland'

const emit = defineEmits<{ close: [] }>()

const toast = useToast()
const token = ref('')

const { mutate, isLoading, error, reset } = useSkalandSignIn({
  onSuccess() {
    toast.create({ title: '新增成功' })
    emit('close')
  },
})
</script>

<template>
  <main>
    <div p-4 space-y-2>
      <p>1. 打开森空岛网页版并登录</p>
      <p>
        2. 登录森空岛网页版后，打开 <a
          href="https://web-api.skland.com/account/info/hg"
          target="_blank"
        >https://web-api.skland.com/account/info/hg</a> 记下 content 字段的值
      </p>
      <p>3. 在下面输入获取到的值</p>
      <div flex="~" relative>
        <input
          v-model="token" type="text"
          border="~ border [&.warning]:red focus:primary"
          p="x-3 y2" flex-1
          bg-background outline-none
          :class="!!error && 'warning animate-shake-x'"
          @focus="reset"
        >
        <p absolute text-xs c-red bottom="-4.5">
          {{ error instanceof FetchError ? '验证出错' : error?.message }}
        </p>
      </div>
    </div>
  </main>
  <footer p="t-5px b-13px" flex="~ justify-center">
    <button
      :disabled="isLoading" h-32px w-250px p-10px
      bg="[url(~/assets/btn-bg.svg)]"
      flex="inline justify-center items-center"
      @click="mutate(token)"
    >
      {{ isLoading ? 'Loading...' : '新增账户' }}
    </button>
  </footer>
</template>
