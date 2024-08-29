import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    base: './',
    resolve: {
      alias: {
        '@r': resolve('src/renderer/src'),
        '@': resolve('./')
      }
    },
    plugins: [vue()],
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
