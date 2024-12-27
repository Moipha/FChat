import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDownloadStore = defineStore(
  'download',
  () => {
    // 记录本地已经下载的文件路径和状态
    /**
     * {_id: String, path: String, status: Boolean}
     */
    const files = ref({})

    // 向map中添加文件
    function addFile(file) {
      files.value[file._id] = file
    }
    return { files, addFile }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'download',
          storage: localStorage,
          paths: ['files']
        }
      ]
    }
  }
)
