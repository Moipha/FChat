import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

// 使用pinia持久化插件
const pinia = createPinia()
pinia.use(piniaPersist)
const app = createApp(App)
// 引入路由
app.use(router)
// 引入pinia管理数据
app.use(pinia)

app.mount('#app')
