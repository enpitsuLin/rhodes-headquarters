import { createPinia } from 'pinia'
import { setupLayouts } from 'virtual:generated-layouts'
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import '~/styles'

const router = createRouter({
  history: createWebHashHistory(),
  routes: setupLayouts(routes),
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
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')
