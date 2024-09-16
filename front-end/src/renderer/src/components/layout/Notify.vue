<template>
  <Transition name="fade">
    <div v-show="visible" class="msg-wrapper">
      {{ msg }}
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 窗口是否可见
const visible = ref(false)
// 弹窗内容
const msg = ref('请按住空格键至少一秒钟以正常录制音频')
// 计时器
let timer = null

// 显示弹窗
function showMsg(message, duration = 2000) {
  msg.value = message
  visible.value = true
  // 清除上一次的定时器
  if (timer) {
    clearTimeout(timer)
  }
  // 设置新的定时器
  timer = setTimeout(() => {
    visible.value = false
    // 计时结束后重置
    timer = null
  }, duration)
}

defineExpose({ showMsg })
</script>

<style lang="scss" scoped>
.msg-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 15px 20px;
  transform: translate(-50%, -50%);
  color: white;
  background-color: black;
  border-radius: 5px;
  font-size: 14px;
  font-family: microsoft YaHei;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
