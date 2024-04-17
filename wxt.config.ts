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
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    },
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
        // eslint-disable-next-line node/prefer-global/process
        __ENABLE_DEVTOOL__: process.env.ENABLE_DEVTOOL,
      },
      plugins: [
        Vue(),
        Icons(),
        UnoCSS(),
        {
          name: 'dev-tool-prod-prune',
          apply: 'build',
          transform(code, id) {
            if (id.includes('utils/dev-tools'))
              return { code: '', id }
            return { code, id }
          },
        },
      ],
    }
  },
})
