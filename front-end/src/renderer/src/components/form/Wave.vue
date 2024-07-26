<template>
  <div v-if="!recording" class="tip" @mousedown="startRecording">按住空格以录制音频</div>
  <ul v-else class="wave-menu" @mouseup="stopRecording" @mouseleave="stopRecording">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const recording = ref(false)

const startRecording = () => {
  recording.value = true
}

const stopRecording = () => {
  recording.value = false
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
.tip {
  font-weight: bolder;
  cursor: pointer;
}
.wave-menu {
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: ease 0.2s;
  position: relative;
  background: var(--bg);
  li {
    list-style: none;
    height: 30px;
    width: 4px;
    border-radius: 10px;
    background: var(--primary);
    margin: 0 6px;
    padding: 0;
    animation-name: wave1;
    animation-duration: 0.3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    transition: ease 0.2s;

    &:nth-child(2) {
      animation-name: wave2;
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-name: wave3;
      animation-duration: 0.4s;
    }
    &:nth-child(4) {
      animation-name: wave4;
      animation-delay: 0.1s;
      animation-duration: 0.3s;
    }
    &:nth-child(5) {
      animation-delay: 0.5s;
    }
    &:nth-child(6) {
      animation-name: wave2;
      animation-duration: 0.5s;
    }
    &:nth-child(8) {
      animation-name: wave4;
      animation-delay: 0.4s;
      animation-duration: 0.25s;
    }
    &:nth-child(9) {
      animation-name: wave3;
      animation-delay: 0.15s;
    }
  }
}

@keyframes wave1 {
  from {
    transform: scaleY(1);
  }

  to {
    transform: scaleY(0.5);
  }
}

@keyframes wave2 {
  from {
    transform: scaleY(0.3);
  }

  to {
    transform: scaleY(0.6);
  }
}

@keyframes wave3 {
  from {
    transform: scaleY(0.6);
  }

  to {
    transform: scaleY(0.8);
  }
}

@keyframes wave4 {
  from {
    transform: scaleY(0.2);
  }

  to {
    transform: scaleY(0.5);
  }
}
</style>
