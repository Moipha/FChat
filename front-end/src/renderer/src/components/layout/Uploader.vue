<script lang="ts" setup>
import Dialog from '@r/components/layout/Dialog.vue'

import { ref, computed, onUnmounted, onMounted } from 'vue'
import formatFileSize from '@r/utils/fileSizeFormat.js'

// input元素
const uploader = ref(null)
// 当前要上传的文件
const files = ref([])
// 确认弹窗
const dialog = ref(false)
// 是否显示拖拽区域
const dragOver = ref(false)
// 拖拽计数器
let dragCount = 0

// 打开上传窗口
function openUpload() {
  if (uploader.value) {
    uploader.value.click()
  } else {
    window.$notify('未知错误导致无法上传')
  }
}

// 上传文件
function onUploadFile(e) {
  const input = e.target
  if (!input || !input.files) return
  // 保存文件信息。不重复添加文件
  Array.from(input.files).forEach(addFile)

  // 打开确认弹窗
  dialog.value = true
}

// 添加文件到列表
function addFile(file) {
  if (!files.value.some((f) => f.name === file.name && f.size === file.size)) {
    files.value.push(file)
  } else {
    window.$notify('重复文件已过滤')
  }
}

// 上传回调
function onUploadSuccess() {
  dialog.value = false
}

// 确定弹窗标题
const dialogTitle = computed(() => {
  return files.value.length > 1 ? `已选中 ${files.value.length} 个文件` : `发送文件`
})

// 移除文件
function removeFile(file) {
  files.value = files.value.filter((f) => f !== file)
}
// 取消上传
function cancelUpload() {
  dialog.value = false
  files.value = []
}

// 拖拽区域全局监听
function setupDragAndDrop() {
  const right = document.getElementById('right')
  right.addEventListener('dragenter', () => {
    dragCount++
    dragOver.value = true
  })

  right.addEventListener('dragleave', () => {
    dragCount--
    if (dragCount === 0) {
      dragOver.value = false
    }
  })
}

// 拖拽文件释放
function onFileDrop(e) {
  e.preventDefault()
  dragOver.value = false // 隐藏拖拽区域
  dragCount = 0 // 重置计数器

  const fileList = e.dataTransfer?.files
  if (!fileList) return

  Array.from(fileList).forEach((file) => addFile(file))
  dialog.value = true // 打开弹窗
}

// 组件挂载时设置拖拽监听
onMounted(() => {
  setupDragAndDrop()
})

// 卸载时清理事件监听
onUnmounted(() => {
  const right = document.getElementById('right')
  right.removeEventListener('dragenter', () => {})
  right.removeEventListener('dragleave', () => {})
})

defineExpose({
  openUpload
})
</script>

<template>
  <input ref="uploader" class="uploader" type="file" multiple @change="onUploadFile" />
  <Dialog
    v-model="dialog"
    :title="dialogTitle"
    confirm-label="发送"
    third-label="添加"
    third-btn
    @cancel="cancelUpload"
    @confirm="onUploadSuccess"
    @third="openUpload"
  >
    <div v-for="file of files" :key="file.id" class="file">
      <Icon class="icon" name="file" />
      <div class="detail">
        <span class="name">{{ file.name }}</span>
        <span class="size">{{ formatFileSize(file.size) }}</span>
      </div>
      <Icon class="delete" name="delete" @click="removeFile(file)" />
    </div>
    <div v-if="!files.length" class="empty">
      <span>... 点击左下角来选择你要发送的文件...</span>
    </div>
  </Dialog>
  <!-- 拖拽区域 -->
  <Transition>
    <div
      v-if="dragOver"
      class="drag-overlay"
      @dragenter.prevent
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="onFileDrop"
    >
      <p>释放文件以上传</p>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.uploader {
  display: none;
}
.file {
  margin: 5px;
  display: flex;
  flex-flow: row wrap;
  gap: 12px;
  align-items: center;
  padding: 10px 15px;
  border-radius: 10px;

  .icon {
    font-size: 26px;
    padding: 12px;
    color: var(--btn-text);
    background-color: var(--primary);
    clip-path: circle(50%);
  }

  .detail {
    display: flex;
    flex-flow: column wrap;
    gap: 5px;
    color: var(--text);

    .name {
      font-size: 16px;
      font-weight: bold;
    }
    .size {
      font-size: 14px;
      color: var(--light-text);
    }
  }

  .delete {
    margin-left: auto;
    padding: 5px;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: var(--primary);
    }
  }

  &:hover {
    background-color: var(--hover);
  }
}

.empty {
  font-size: 18px;
  font-family: dyh;
  margin: auto;
  line-height: 80px;
}

.drag-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-family: dyh;
  z-index: 101;
  transition: 0.2s ease;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
