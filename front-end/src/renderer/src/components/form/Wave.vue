<template>
  <div class="audio-container">
    <div class="tip dyh">
      {{ recording ? '录制中...' : '按住空格以录制音频' }}
    </div>
    <Teleport to="body">
      <div v-show="recording" class="mask">
        <div class="listening">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 26">
            <g id="audio-wave" data-name="audio-wave">
              <rect id="wave-5" class="wave" x="32" y="7" width="4" height="12" rx="2" ry="2" />
              <rect id="wave-4" class="wave" x="24" y="2" width="4" height="22" rx="2" ry="2" />
              <rect id="wave-3" class="wave" x="16" width="4" height="26" rx="2" ry="2" />
              <rect id="wave-2" class="wave" x="8" y="5" width="4" height="16" rx="2" ry="2" />
              <rect id="wave-1" class="wave" y="9" width="4" height="8" rx="2" ry="2" />
              <rect
                id="wave-5-2"
                data-name="wave-4"
                class="wave"
                x="72"
                y="7"
                width="4"
                height="12"
                rx="2"
                ry="2"
              />
              <rect
                id="wave-4-2"
                data-name="wave-5"
                class="wave"
                x="64"
                y="2"
                width="4"
                height="22"
                rx="2"
                ry="2"
              />
              <rect
                id="wave-3-2"
                data-name="wave-3"
                class="wave"
                x="56"
                width="4"
                height="26"
                rx="2"
                ry="2"
              />
              <rect
                id="wave-2-2"
                data-name="wave-2"
                class="wave"
                x="48"
                y="5"
                width="4"
                height="16"
                rx="2"
                ry="2"
              />
              <rect
                id="wave-1-2"
                data-name="wave-1"
                class="wave"
                x="40"
                y="9"
                width="4"
                height="8"
                rx="2"
                ry="2"
              />
            </g>
          </svg>
        </div>
      </div>
      <div v-show="dialog" class="mask">
        <div class="dialog">
          <audio ref="audio" :src="audioUrl" controls></audio>
          <div class="btn-container">
            <Btn type="primary" label="发送" @click="sendAudio" />
            <Btn label="取消" @click="dialog = false" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, inject, getCurrentInstance } from 'vue'
import Btn from '@r/components/form/Btn.vue'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 接收socket
const socket = inject('socket')
// 接受用户信息
const { user, friend } = defineProps({
  friend: {
    type: Object,
    default: () => ({})
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

// 录制状态
const recording = ref(false)

// 窗口
const dialog = ref(false)

// 音频相关
let mediaRecorder
let audioChunks = []
let stream
let startTime
let audioUrl
// 载入时获取用户麦克风权限
async function getStream() {
  // 获取权限
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    alert('获取麦克风权限失败' + e.message)
  }
}
getStream().then(() => {
  stream.getTracks().forEach((track) => track.stop())
})
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
    proxy.$notify('录制时间过短！请至少录制一秒钟的时间')
    console.log('录音时间过短，不做处理')
    return
  }
  if (mediaRecorder) {
    // 停止录制
    mediaRecorder.stop()
    mediaRecorder.onstop = () => {
      // 获取二进制格式音频文件
      audioUrl = URL.createObjectURL(new Blob(audioChunks, { type: 'audio/wav' }))
      dialog.value = true
    }
  }
}

// 发送语音
function sendAudio() {
  socket.emit('chat', {
    audio: new Blob(audioChunks, { type: 'audio/wav' }),
    senderId: user._id,
    receiverId: friend._id,
    type: 'audio'
  })
  dialog.value = false
}

// 打开弹窗后解除键盘事件
watch(dialog, (val) => {
  if (val) {
    unbindKeyboardEvent()
  } else {
    bindKeyboardEvent()
    audioChunks = []
  }
})

// 键盘事件
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

// 绑定和解绑键盘事件
function bindKeyboardEvent() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
}

function unbindKeyboardEvent() {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
}

onMounted(() => {
  bindKeyboardEvent()
})

onUnmounted(() => {
  unbindKeyboardEvent()
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
}

.mask {
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0;
  background-color: #00000066;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog {
    width: 320px;
    height: 130px;
    border-radius: 4px;
    background-color: var(--bg);
    padding: 10px 10px;
    box-sizing: border-box;

    .btn-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }

  .listening {
    width: 152px;
    padding: 30px 20px;
    border-radius: 10px;
    background-color: var(--primary);
    color: var(--btn-text);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.8);
  }

  .wave {
    animation-name: pulse;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    height: 4px;
    y: 11px;
  }

  #wave-1,
  #wave-1-2 {
    animation-delay: 0.2s;
  }

  #wave-2,
  #wave-2-2 {
    animation-delay: 1s;
  }

  #wave-3,
  #wave-3-2 {
    animation-delay: 0.6s;
  }

  #wave-5,
  #wave-5-2 {
    animation-delay: 0.4s;
  }

  #wave-4,
  #wave-4-2 {
    animation-delay: 0.8s;
  }

  @keyframes pulse {
    0%,
    100% {
      height: 4px;
      y: 11px;
    }

    50% {
      height: 26px;
      y: 0px;
    }
  }
}
</style>
