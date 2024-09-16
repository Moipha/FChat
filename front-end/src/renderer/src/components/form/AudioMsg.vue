<template>
  <div class="audio" :class="position">
    <Icon class="icon" :name="playing ? 'pause' : 'play'" @click="togglePlay" />
    <div class="controls">
      <div class="slider" @click="setProgress($event)">
        <div class="progress" :style="{ width: `${progress}%` }">
          <div id="progress-pin" class="pin" @mousedown="startDrag"></div>
        </div>
      </div>
      <div class="time-container">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span>/</span>
        <span class="total-time">{{ formatTime(duration) }}</span>
      </div>
    </div>
    <audio
      ref="audio"
      :src="src"
      preload="auto"
      @timeupdate="updateProgress"
      @loadedmetadata.once="setDuration"
      @ended="resetPlayer"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  src: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'right'
  }
})

// 音频元素
const audio = ref(null)
// 播放状态
const playing = ref(false)
// 进度条
const progress = ref(0)
const duration = ref(0) // 总时长
const currentTime = ref(0) // 当前时间

// 播放/暂停切换
function togglePlay() {
  if (!audio.value) return
  if (playing.value) {
    audio.value.pause()
  } else {
    audio.value.play()
    requestAnimationFrame(updateProgress)
  }
  playing.value = !playing.value
}

// 更新进度条和当前时间
function updateProgress() {
  if (!audio.value) return
  const current = audio.value.currentTime
  currentTime.value = current
  progress.value = (current / duration.value) * 100

  // 每0.1秒更新一次
  if (playing.value) {
    requestAnimationFrame(updateProgress)
  }
}

// 设置总时长
async function setDuration() {
  if (!audio.value) return
  while (audio.value.duration === Infinity) {
    await new Promise((r) => setTimeout(r, 200))
    audio.value.currentTime = 10000000 * Math.random()
  }
  duration.value = audio.value.duration
  currentTime.value = 0
  progress.value = 0
  audio.value.currentTime = 0
  updateProgress()
  // TODO 解决较长音频文件进度条闪动的问题
}

// 拖动进度条
function setProgress(event) {
  if (!audio.value) return
  const slider = event.currentTarget
  const rect = slider.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const newProgress = (offsetX / rect.width) * audio.value.duration
  audio.value.currentTime = newProgress
  updateProgress()
}

// 拖动滑块
let isDragging = false
function startDrag() {
  isDragging = true
  document.addEventListener('mousemove', dragProgress)
  document.addEventListener('mouseup', stopDrag)
}

function dragProgress(event) {
  if (!isDragging || !audio.value) return
  const slider = document.querySelector('.slider')
  const rect = slider.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const newProgress = Math.min(Math.max(offsetX / rect.width, 0), 1) * audio.value.duration
  audio.value.currentTime = newProgress
  updateProgress()
}

function stopDrag() {
  isDragging = false
  document.removeEventListener('mousemove', dragProgress)
  document.removeEventListener('mouseup', stopDrag)
}

// 格式化时间
function formatTime(time) {
  const minutes = Math.floor(time / 60) // 分钟部分
  const seconds = Math.floor(time % 60) // 秒钟部分
  const milliseconds = Math.floor((time % 1) * 10) // 0.1秒部分
  // 格式化秒钟部分为两位数
  const formattedSeconds = seconds.toString().padStart(2, '0')
  return `${minutes}:${formattedSeconds}:${milliseconds}`
}

// 重置播放器状态
function resetPlayer() {
  if (!audio.value) return
  audio.value.currentTime = 0
  progress.value = 0
  currentTime.value = 0
  playing.value = false
}
</script>

<style lang="scss" scoped>
.left {
  --active: var(--primary);
  --word: var(--text);
  --slider: var(--light-text);
  --after: var(--primary);

  .icon {
    position: relative;
    z-index: 1;

    &::after {
      content: '';
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
      background-color: var(--btn-text);
      clip-path: circle(15px);
      z-index: -1;
    }
  }
}

.right {
  --active: var(--btn-text);
  --word: var(--btn-text);
  --slider: var(--border);
  --after: var(--btn-text);
}

.audio {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  user-select: none;
  -webkit-user-select: none;
  padding: 0 5px;
  gap: 20px;

  .icon {
    font-size: 40px;
    color: var(--active);
    cursor: pointer;
  }

  .controls {
    font-size: 16px;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    margin-top: 15px;

    .slider {
      width: 100%;
      min-width: 120px;
      height: 4px;
      flex-grow: 1;
      border-radius: 2px;
      background-color: var(--slider);
      cursor: pointer;
      position: relative;

      .progress {
        width: 0;
        height: 100%;
        background-color: var(--active);
        border-radius: inherit;
        position: absolute;
        pointer-events: none;

        .pin {
          right: -6px;
          top: -4px;
          height: 12px;
          width: 12px;
          border-radius: 8px;
          background-color: var(--active);
          position: absolute;
          pointer-events: all;
        }
      }
    }

    .time-container {
      margin-left: -5px;
      display: flex;
      gap: 5px;
      color: var(--word);
      font-family: consolas;
      font-weight: normal;
      font-size: 14px;
    }
  }
}
</style>
