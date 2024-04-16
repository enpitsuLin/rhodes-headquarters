import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
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

        Components({
          dirs: [resolve('components')],
          // generate `components.d.ts` for ts support with Volar
          dts: resolve('components.d.ts'),
          resolvers: [
            // auto import icons
            IconsResolver({
              prefix: '',
            }),
          ],
        }),
        Icons(),
        UnoCSS(),
      ],
    }
  },
})
