import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'wxt'
import pkg from './package.json'

export default defineConfig({
  manifestVersion: 3,
  srcDir: 'src',
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
    return {
      define: {
        __DEV__: env.mode === 'serve',
        __NAME__: JSON.stringify(pkg.name),
      },
      build: {
        sourcemap: env.mode === 'serve',
      },
      plugins: [
        VueRouter({
          dts: './src/typed-router.d.ts',
        }),
        Vue(),
        UnoCSS(),
      ],
    }
  },
})
