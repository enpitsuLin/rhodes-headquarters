import type {
  RouteRecordRaw,
} from 'vue-router/auto'
import {
  createMemoryHistory,
  createRouter,
} from 'vue-router/auto'
import '~/styles'
import App from './App.vue'

const router = createRouter({
  history: createMemoryHistory(),
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
