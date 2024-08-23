import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSignStore = defineStore(
  'sign',
  () => {
    // 保存新用户信息
    const newUser = ref({})
    const lastSendTime = ref(null)
    return { newUser, lastSendTime }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'sign',
          storage: localStorage
        }
      ]
    }
  }
)
