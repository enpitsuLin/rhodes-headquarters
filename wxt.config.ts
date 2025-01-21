import { resolve } from 'node:path'
import VueRouter from 'unplugin-vue-router/vite'
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
  analysis: {
    template: 'raw-data',
    keepArtifacts: true,
    outputFile: '.analysis/stats.html',
  },
  imports: {
    presets: ['vue'],
    addons: {
      vueTemplate: true,
    },
  },
  alias: {
    background: resolve('src/entrypoints/background'),
  },
  vite(env) {
    return {
      ssr: {
        noExternal: ['@webext-core/messaging', '@webext-core/proxy-service'],
      },
      define: {
        __PUB_VERSION__: JSON.stringify(pkg.publishVersion),
        __VERSION__: JSON.stringify(pkg.version),
        __NAME__: JSON.stringify(pkg.name),
      },
      build: {
        sourcemap: env.mode === 'serve',
      },
      plugins: [

        VueRouter({
          dts: './src/typed-router.d.ts',
        }),
        Layouts(),

        VueDevTools({ appendTo: /main\.ts/ }),
      ],
    }
  },
})
