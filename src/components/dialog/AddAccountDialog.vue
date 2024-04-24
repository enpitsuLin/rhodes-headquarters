<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useDialog } from '@/composables/use-dialog'
import { usePresence } from '@/composables/use-presence'

const open = defineModel<boolean>('open', { required: true })

const nodeRef = ref<HTMLDivElement | null>(null)

const accountService = getAccountService()

const token = ref('')
const errorMessage = ref('')

const api = useDialog({
  open,
  onOpenChange(to) {
    open.value = to
  },
})

const presenceApi = usePresence({
  present: computed(() => api.value.open),
  onExitComplete: () => {
    open.value = false
    errorMessage.value = ''
    token.value = ''
  },
})

watch(nodeRef, () => {
  if (nodeRef.value) {
    const node = nodeRef.value
    if (node)
      presenceApi.value.setNode(node)
  }
})

const { isLoading, execute } = useAsyncState(
  async () => {
    if (token.value) {
      await accountService.logInOrRefreshAccount(token.value)
      return true
    }
    throw new Error('凭证为空')
  },
  false,
  {
    immediate: false,
    onSuccess() {
      token.value = ''
      open.value = false
    },
    onError(e) {
      if ((e as Error).toString().includes('FetchError'))
        errorMessage.value = '验证出错'
      else
        errorMessage.value = (e as Error).message
    },
  },
)
</script>

<template>
  <slot />
  <Teleport to="body">
    <div v-if="presenceApi.present" fixed inset-0>
      <div
        v-bind="api.backdropProps" fixed inset-0 z-100 bg-border:10 backdrop-blur-3
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out"
      />
      <div v-bind="api.positionerProps" fixed inset-0 z-200 flex="~ items-center justify-center">
        <div
          ref="nodeRef"
          v-bind="api.contentProps" shadow="lg" w-320px relative
          flex="~ col" bg-background
          class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:fade-out"
        >
          <header v-bind="api.titleProps" h-50px relative flex="~ items-end" border="l-5px primary" select-none>
            <div flex="~ items-baseline" pb-1 pl-4>
              <div flex="~ items-center">
                <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_256_438)">
                    <path d="M6 3V0H0V17.991V18H6V15H3V3H6Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_256_438">
                      <rect width="6" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span text-base font-bold>新增账户</span>
                <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_256_441)">
                    <path d="M0 3V0H6V17.991V18H0V15H3V3H0Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_256_441">
                      <rect width="6" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <svg c-border width="142" height="13" viewBox="0 0 142 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.74432 0.363636V12H7.61932L2.55682 4.67614H2.47159V12H0.0113636V0.363636H2.17045L7.19318 7.68182H7.29545V0.363636H9.74432ZM11.777 12V0.363636H19.6179V2.39205H14.2372V5.16477H19.2145V7.19318H14.2372V9.97159H19.6406V12H11.777ZM24.1932 12L20.8636 0.363636H23.5511L25.4773 8.44886H25.5739L27.6989 0.363636H30L32.1193 8.46591H32.2216L34.1477 0.363636H36.8352L33.5057 12H31.108L28.892 4.39205H28.8011L26.5909 12H24.1932ZM52.1222 4.4375H49.6335C49.5881 4.11553 49.4953 3.82955 49.3551 3.57955C49.215 3.32576 49.035 3.10985 48.8153 2.93182C48.5956 2.75379 48.3419 2.61742 48.054 2.52273C47.7699 2.42803 47.4612 2.38068 47.1278 2.38068C46.5256 2.38068 46.0009 2.5303 45.554 2.82955C45.107 3.125 44.7604 3.55682 44.5142 4.125C44.268 4.68939 44.1449 5.375 44.1449 6.18182C44.1449 7.01136 44.268 7.70833 44.5142 8.27273C44.7642 8.83712 45.1127 9.26326 45.5597 9.55114C46.0066 9.83902 46.5237 9.98295 47.1108 9.98295C47.4403 9.98295 47.7453 9.93939 48.0256 9.85227C48.3097 9.76515 48.5616 9.63826 48.7812 9.47159C49.0009 9.30114 49.1828 9.0947 49.3267 8.85227C49.4744 8.60985 49.5767 8.33333 49.6335 8.02273L52.1222 8.03409C52.0578 8.56818 51.8968 9.08333 51.6392 9.57955C51.3854 10.072 51.0426 10.5133 50.6108 10.9034C50.1828 11.2898 49.6714 11.5966 49.0767 11.8239C48.4858 12.0473 47.8172 12.1591 47.071 12.1591C46.0331 12.1591 45.1051 11.9242 44.2869 11.4545C43.4725 10.9848 42.8286 10.3049 42.3551 9.41477C41.8854 8.52462 41.6506 7.44697 41.6506 6.18182C41.6506 4.91288 41.8892 3.83333 42.3665 2.94318C42.8438 2.05303 43.4915 1.375 44.3097 0.909091C45.1278 0.439394 46.0483 0.204545 47.071 0.204545C47.7453 0.204545 48.3703 0.299242 48.946 0.488636C49.5256 0.67803 50.0388 0.954545 50.4858 1.31818C50.9328 1.67803 51.2964 2.11932 51.5767 2.64205C51.8608 3.16477 52.0426 3.76326 52.1222 4.4375ZM53.8864 12V0.363636H56.3466V5.16477H61.3409V0.363636H63.7955V12H61.3409V7.19318H56.3466V12H53.8864ZM67.8295 12H65.1932L69.2102 0.363636H72.3807L76.392 12H73.7557L70.8409 3.02273H70.75L67.8295 12ZM67.6648 7.42614H73.892V9.34659H67.6648V7.42614ZM77.7926 12V0.363636H82.3835C83.2623 0.363636 84.0123 0.520833 84.6335 0.835227C85.2585 1.14583 85.7339 1.58712 86.0597 2.15909C86.3892 2.72727 86.554 3.39583 86.554 4.16477C86.554 4.9375 86.3873 5.60227 86.054 6.15909C85.7206 6.71212 85.2377 7.13636 84.6051 7.43182C83.9763 7.72727 83.215 7.875 82.321 7.875H79.2472V5.89773H81.9233C82.393 5.89773 82.7831 5.83333 83.0938 5.70455C83.4044 5.57576 83.6354 5.38258 83.7869 5.125C83.9422 4.86742 84.0199 4.54735 84.0199 4.16477C84.0199 3.77841 83.9422 3.45265 83.7869 3.1875C83.6354 2.92235 83.4025 2.72159 83.0881 2.58523C82.7775 2.44508 82.3854 2.375 81.9119 2.375H80.2528V12H77.7926ZM84.0767 6.70455L86.9688 12H84.2528L81.4233 6.70455H84.0767ZM90.2983 12H87.6619L91.679 0.363636H94.8494L98.8608 12H96.2244L93.3097 3.02273H93.2188L90.2983 12ZM90.1335 7.42614H96.3608V9.34659H90.1335V7.42614ZM109.982 4.4375H107.493C107.447 4.11553 107.355 3.82955 107.214 3.57955C107.074 3.32576 106.894 3.10985 106.675 2.93182C106.455 2.75379 106.201 2.61742 105.913 2.52273C105.629 2.42803 105.321 2.38068 104.987 2.38068C104.385 2.38068 103.86 2.5303 103.413 2.82955C102.966 3.125 102.62 3.55682 102.374 4.125C102.127 4.68939 102.004 5.375 102.004 6.18182C102.004 7.01136 102.127 7.70833 102.374 8.27273C102.624 8.83712 102.972 9.26326 103.419 9.55114C103.866 9.83902 104.383 9.98295 104.97 9.98295C105.3 9.98295 105.605 9.93939 105.885 9.85227C106.169 9.76515 106.421 9.63826 106.641 9.47159C106.86 9.30114 107.042 9.0947 107.186 8.85227C107.334 8.60985 107.436 8.33333 107.493 8.02273L109.982 8.03409C109.917 8.56818 109.756 9.08333 109.499 9.57955C109.245 10.072 108.902 10.5133 108.47 10.9034C108.042 11.2898 107.531 11.5966 106.936 11.8239C106.345 12.0473 105.677 12.1591 104.93 12.1591C103.893 12.1591 102.964 11.9242 102.146 11.4545C101.332 10.9848 100.688 10.3049 100.214 9.41477C99.7448 8.52462 99.5099 7.44697 99.5099 6.18182C99.5099 4.91288 99.7486 3.83333 100.226 2.94318C100.703 2.05303 101.351 1.375 102.169 0.909091C102.987 0.439394 103.908 0.204545 104.93 0.204545C105.605 0.204545 106.23 0.299242 106.805 0.488636C107.385 0.67803 107.898 0.954545 108.345 1.31818C108.792 1.67803 109.156 2.11932 109.436 2.64205C109.72 3.16477 109.902 3.76326 109.982 4.4375ZM111.303 2.39205V0.363636H120.859V2.39205H117.297V12H114.865V2.39205H111.303ZM122.433 12V0.363636H130.274V2.39205H124.893V5.16477H129.871V7.19318H124.893V9.97159H130.297V12H122.433ZM132.23 12V0.363636H136.821C137.7 0.363636 138.45 0.520833 139.071 0.835227C139.696 1.14583 140.171 1.58712 140.497 2.15909C140.827 2.72727 140.991 3.39583 140.991 4.16477C140.991 4.9375 140.825 5.60227 140.491 6.15909C140.158 6.71212 139.675 7.13636 139.043 7.43182C138.414 7.72727 137.652 7.875 136.759 7.875H133.685V5.89773H136.361C136.83 5.89773 137.221 5.83333 137.531 5.70455C137.842 5.57576 138.073 5.38258 138.224 5.125C138.38 4.86742 138.457 4.54735 138.457 4.16477C138.457 3.77841 138.38 3.45265 138.224 3.1875C138.073 2.92235 137.84 2.72159 137.526 2.58523C137.215 2.44508 136.823 2.375 136.349 2.375H134.69V12H132.23ZM138.514 6.70455L141.406 12H138.69L135.861 6.70455H138.514Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div absolute bottom-1px left-16px h-1px w-300px bg-border>
              <div absolute size-3px left="-1px" bottom="-1px" bg-border />
            </div>
          </header>
          <main>
            <div space-y-2 p-4>
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
                  v-model="token"
                  type="text"
                  bg-background border="~ border [&.warning]:red focus:primary"
                  flex-1 p="x-3 y2" outline-none
                  :class="!!errorMessage && 'warning animate-shake'"
                  @focus="errorMessage = ''"
                >
                <p absolute text-xs c-red bottom="-4.5">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </main>
          <footer p="t-5px b-13px" flex="~ justify-center">
            <button
              :disabled="isLoading"
              w-250px h-32px p-10px
              bg="[url(./btn-bg.svg)]"
              flex="inline justify-center items-center"
              @click="execute()"
            >
              {{ isLoading ? 'Loading...' : '新增账户' }}
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>
