import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    // 主题
    const theme = ref('light-theme')

    // 导航栏 chat/friend/group
    const nav = ref('chat')
    // 二级路由
    const routeMap = ref({})

    // 退出登录
    function logout() {
      routeMap.value = {}
      nav.value = 'chat'
    }

    return { theme, nav, routeMap, logout }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'setting',
          storage: localStorage
        }
      ]
    }
  }
)
