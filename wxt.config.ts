import { resolve } from 'node:path'
import VueRouter from 'unplugin-vue-router/vite'
import { analyzer } from 'vite-bundle-analyzer'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import { defineConfig } from 'wxt'
import pkg from './package.json'

export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/unocss'],
  manifestVersion: 3,
  srcDir: resolve('src'),
  publicDir: resolve('public'),
  manifest: {
    name: pkg.displayName || pkg.name,
    version: pkg.publishVersion,
    version_name: pkg.version,
    description: pkg.description,
    permissions: [
      'storage',
      'alarms',
      'notifications',
    ],
    host_permissions: ['*://*/*'],
  },
  imports: {
    presets: ['vue'],
    addons: {
      vueTemplate: true,
    },
  },
  vite(env) {
    const plugins = [

      VueRouter({
        dts: './src/typed-router.d.ts',
      }),
      Layouts(),

      VueDevTools({ appendTo: /main\.ts/ }),
    ]
    // eslint-disable-next-line node/prefer-global/process
    if (process.env.ANALYZE === 'true') {
      plugins.push(analyzer())
    }
    return {
      ssr: {
        noExternal: ['@webext-core/messaging', '@webext-core/proxy-service'],
      },
      define: {
        __DEV__: env.mode === 'serve',
        __NAME__: JSON.stringify(pkg.name),
      },
      build: {
        sourcemap: env.mode === 'serve',
      },
      plugins,
    }
  },
})
