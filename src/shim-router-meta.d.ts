import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'default' | 'options'
    title?: string
    backgroundTitle?: string
    contentClass?: string
  }
}
