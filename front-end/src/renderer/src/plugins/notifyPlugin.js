import { createApp } from 'vue'
import Notify from '@r/components/layout/Notify.vue'

export default {
  install(app) {
    const notifyApp = createApp(Notify)
    const container = document.createElement('div')
    document.body.appendChild(container)
    const vm = notifyApp.mount(container)

    // 全局注册显示通知的方法
    app.config.globalProperties.$notify = vm.showMsg
  }
}
