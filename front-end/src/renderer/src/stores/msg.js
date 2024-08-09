import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMsgStore = defineStore(
  'msg',
  () => {
    // 保存与每个好友的聊天记录
    const msgMap = ref({})

    return { msgMap }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'msg',
          storage: sessionStorage,
          paths: ['msgMap']
        }
      ]
    }
  }
)
