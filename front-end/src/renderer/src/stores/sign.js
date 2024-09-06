import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSignStore = defineStore(
  'sign',
  () => {
    // 保存新用户信息
    const newUser = ref({})
    const lastSendTime = ref(null)
    // 新添加用户
    const addUser = ref({})
    return { newUser, lastSendTime, addUser }
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
