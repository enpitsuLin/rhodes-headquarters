import type {
  RouteRecordRaw,
} from 'vue-router/auto'
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router/auto'
import '~/styles'
import App from './App.vue'
import { PORT_NAME } from './constsants'
import { PORT_INJECT_KEY } from '~/composables/port'

const port = browser.runtime.connect({
  name: PORT_NAME,
})

const router = createRouter({
  history: createWebHashHistory(),
  extendRoutes(routers) {
    const res = routers.map((route) => {
      if (route.path === '/' && location.pathname === '/options.html') {
        return {
          ...route,
          redirect: '/options',
        } as RouteRecordRaw
      }

      return route
    })
    return res
  },
})

const app = createApp(App)

app.provide(PORT_INJECT_KEY, port)

app.use(router)
app.mount('#app')
