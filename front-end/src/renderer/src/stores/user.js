import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 保存用户信息和token
    const user = ref(null)
    const token = ref(null)
    // 用户好友列表
    const friends = ref([])

    return { user, token, friends }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'user',
          storage: localStorage
        }
      ]
    }
  }
)
