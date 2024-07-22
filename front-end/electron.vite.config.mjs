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
    resolve: {
      alias: {
        '@r': resolve('src/renderer/src')
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
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4523', // 你的后端服务地址
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, '/m1/4865713-0-default/') // 重写请求路径
        }
      }
    }
  }
})
