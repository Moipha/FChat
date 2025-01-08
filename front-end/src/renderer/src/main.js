import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import notifyPlugin from './plugins/notifyPlugin'
import Icon from '@r/components/form/Icon.vue'
import _ from 'lodash'
import 'overlayscrollbars/overlayscrollbars.css'

// 使用lodash
window._ = _
// 使用pinia持久化插件
const pinia = createPinia()
pinia.use(piniaPersist)
const app = createApp(App)
// 引入路由
app.use(router)
// 引入pinia管理数据
app.use(pinia)
// 载入自定义插件
app.use(notifyPlugin)
// 注册全局组件
app.component('Icon', Icon)

app.mount('#app')
