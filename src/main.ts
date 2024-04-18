import type {
  RouteRecordRaw,
} from 'vue-router/auto'
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router/auto'
import '~/styles'
import App from './App.vue'

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

app.use(router)
app.mount('#app')
