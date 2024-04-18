import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
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
        // eslint-disable-next-line node/prefer-global/process
        __ENABLE_DEVTOOL__: process.env.ENABLE_DEVTOOL,
      },
      build: {
        minify: false,
      },
      plugins: [
        VueRouter({
          dts: './src/typed-router.d.ts',
        }),
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
