<script setup>
import { ref } from 'vue'
import formatFileSize from '@r/utils/fileSizeFormat'
import request from '@r/utils/request'
import { useDownloadStore } from '@r/stores/download'

const { files, addFile } = useDownloadStore()

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

// 是否正在下载中
const isDownloading = ref(false)

async function openFile() {
  if (files[props.file._id]) {
    // 文件已下载，直接打开
    const result = await window.api.openPath(files[props.file._id].path)
    if (result) {
      console.error('无法打开文件:', result)
    }
  } else {
    // 文件未下载，先下载
    isDownloading.value = true
    try {
      const res = await request.get(`/file/${props.file.path}`, {
        responseType: 'arraybuffer'
      })
      // 通过主进程保存文件到本地
      const savePath = await window.api.saveFile({
        fileName: props.file.name,
        fileData: res
      })

      // 更新下载记录
      addFile({
        id: props.file._id,
        path: savePath
      })

      // 打开文件
      const result = await window.api.openPath(savePath)
      if (result) {
        console.error('无法打开文件:', result)
      }
    } catch (error) {
      console.error('下载文件失败:', error)
    } finally {
      isDownloading.value = false
    }
  }
}
</script>

<template>
  <div class="file" @click="openFile">
    <Icon class="icon" name="file" />
    <div class="detail">
      <span class="name">{{ file.name }}</span>
      <span class="size">{{ formatFileSize(file.size) }}</span>
    </div>
    <div class="tag"></div>
  </div>
</template>

<style lang="scss" scoped>
.file {
  display: flex;
  flex-flow: row wrap;
  gap: 12px;
  align-items: center;
  padding: 2px 5px;
  cursor: pointer;

  .icon {
    font-size: 36px;
  }

  .detail {
    display: flex;
    flex-flow: column wrap;

    .name {
      font-size: 14px;
      font-weight: bold;
    }
    .size {
      font-size: 12px;
    }
  }
  .tag {
    width: 20px;
  }
}
</style>
