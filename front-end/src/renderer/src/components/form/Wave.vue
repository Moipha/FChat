<template>
  <div class="audio-container">
    <div
      class="tip dyh"
      @mousedown="startRecording"
      @mouseup="stopRecording"
      @mouseleave="stopRecording"
    >
      {{ recording ? '录制中...' : '按住空格以录制音频' }}
    </div>
    <div class="mask">123</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 录制状态
const recording = ref(false)

// 音频相关
let mediaRecorder
let audioChunks = []
let stream
let startTime
// 载入时获取用户麦克风权限
async function getStream() {
  // 获取权限
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    alert('获取麦克风权限失败' + e.message)
  }
}
getStream()
// 开始录音
async function startRecording() {
  // 防止重复触发
  if (recording.value) return
  // 获取麦克风权限
  if (!stream.active) {
    await getStream()
  }
  // 记录开始时间
  startTime = Date.now()
  recording.value = true
  console.log('录音开始')

  // 创建recorder
  mediaRecorder = new MediaRecorder(stream)
  // 收集音频数据
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data)
  }
  // 开始录制
  mediaRecorder.start()
}

// 停止录音
const stopRecording = () => {
  // 归还权限
  stream.getTracks().forEach((track) => track.stop())
  // 停止录制
  recording.value = false
  console.log('录音结束')
  // 如果按下和松开时间间隔小于0.5秒，不做处理
  const endTime = Date.now()
  if (endTime - startTime < 500) {
    console.log('录音时间过短，不做处理')
    return
  }
  if (mediaRecorder) {
    // 停止录制
    mediaRecorder.stop()
    mediaRecorder.onstop = () => {
      // 获取二进制格式音频文件
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      // 播放刚刚录制的音频
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
      audioChunks = []
    }
  }
}

const handleKeyDown = (event) => {
  if (event.key === ' ') {
    startRecording()
  }
}

const handleKeyUp = (event) => {
  if (event.key === ' ') {
    stopRecording()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style lang="scss" scoped>
.audio-container {
  display: flex;
  width: 100%;

  .tip {
    cursor: pointer;
    font-size: 18px;
    color: var(--text);
    transition: all 0.2s ease;
    padding-right: 10%;
    margin: auto;
    width: 200px;
    text-align: center;
  }

  .mask {
    position: fixed;
    top: 0;
  }
}
</style>
