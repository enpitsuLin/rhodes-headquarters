import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'wxt'
import pkg from './package.json'

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    permissions: [
      'storage',
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
      plugins: [
        Vue(),
        Icons(),
        UnoCSS(),
      ],
    }
  },
})
