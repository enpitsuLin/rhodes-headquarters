import {
  createMemoryHistory,
  createRouter,
} from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import '~/styles'
import { createPinia } from 'pinia'
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
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')
