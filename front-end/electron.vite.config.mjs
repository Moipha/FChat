import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import setupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@r': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), setupExtend()],
    // 默认引入自定义样式变量
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@r/assets/variables.scss";'
        }
      }
    }
  }
})
