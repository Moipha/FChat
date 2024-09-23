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
    // 用户申请列表
    const applyList = ref([])
    // 用户聊天列表
    const chatList = ref(null)

    return { user, token, friends, applyList, chatList }
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
