import {
  createMemoryHistory,
  createRouter,
} from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import '~/styles'
import App from './App.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (
    from.path === '/'
    && to.path === '/'
    && location.pathname === '/options.html'
  ) {
    next('/options')
    return
  }
  next()
})

const app = createApp(App)

app.use(router)
app.mount('#app')

const SKLAND_SM_CONFIG = {
  organization: 'UWXspnCCJN4sfYlNfqps',
  appId: 'default',
  publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmxMNr7n8ZeT0tE1R9j/mPixoinPkeM+k4VGIn/s0k7N5rJAfnZ0eMER+QhwFvshzo0LNmeUkpR8uIlU/GEVr8mN28sKmwd2gpygqj0ePnBmOW4v0ZVwbSYK+izkhVFk2V/doLoMbWy6b+UnA8mkjvg0iYWRByfRsK2gdl7llqCwIDAQAB',
  protocol: 'https',
  apiHost: 'fp-it.portal101.cn',
  apiPath: '/deviceprofile/v4',
}

export function createDeviceIdInIframe(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建一个 iframe 来隔离执行环境
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const iframeWindow = iframe.contentWindow
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeWindow || !iframeDocument) {
      reject(new Error('无法创建 iframe 环境'))
      return
    }

    // @ts-expect-error 在 iframe 中创建必要的全局变量
    iframeWindow._smReadyFuncs = [
      () => {
        // @ts-expect-error: SDK 引入的
        if (iframeWindow.SMSdk) {
        // @ts-expect-error: SDK 引入的
          const deviceId = iframeWindow.SMSdk.getDeviceId()
          resolve(deviceId)
          // 清理 iframe
          document.body.removeChild(iframe)
        }
        else {
          reject(new Error('SMSdk 未能正确加载'))
          document.body.removeChild(iframe)
        }
      },
    ]
    // @ts-expect-error: 配置
    iframeWindow._smConf = SKLAND_SM_CONFIG

    // 创建并添加 script 元素到 iframe
    const script = iframeDocument.createElement('script')
    script.src = '/sm.sdk.js'
    iframeDocument.head.appendChild(script)
  })
}

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'GET_DEVICE_ID') {
    try {
      const deviceId = await createDeviceIdInIframe()
      event.source?.postMessage({ type: 'DEVICE_ID_RESULT', deviceId })
    }
    catch (error) {
      event.source?.postMessage({ type: 'DEVICE_ID_ERROR', error: (error as Error).message })
    }
  }
})
