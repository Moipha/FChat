<template>
  <div
    class="e-card playing"
    :style="{
      '--num': msg.length,
      '--wid': msg.length + 'ch'
    }"
  >
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="info">
      <div class="title">
        <Avatar :size="60" class="icon" :src="icon" />
        <span>FChat</span>
      </div>
      <span ref="subtitle" class="subtitle">{{ msg }}</span>
    </div>
    <div class="version">
      <span class="link" @click="openExternal('https://github.com/Moipha/FChat')">v1.0.0</span>
      <span
        >by
        <span class="link" @click="openExternal('https://github.com/Moipha')">Moipha</span></span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import icon from '@/public/icons/icon.png'
import Avatar from '@r/components/form/Avatar.vue'
import { watch } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  msg: {
    type: String,
    default: 'Welcome to FChat!'
  }
})

const subtitle = ref()

watch(
  () => props.msg,
  () => {
    // 重新播放文字的动画
    if (subtitle.value) {
      subtitle.value.classList.remove('typing-animation')
      // 强制重绘，确保动画重新开始
      void subtitle.value.offsetWidth
      subtitle.value.classList.add('typing-animation')
    }
  }
)

// 打开外部链接
function openExternal(url) {
  window.api.openExternal(url)
}
</script>

<style lang="scss" scoped>
.e-card {
  background: var(--bg);
  box-shadow: 0px 8px 28px -9px rgba(0, 0, 0, 0.45);
  position: relative;
  width: 50%;
  height: 100vh;
  overflow: hidden;
  z-index: 9;

  .info {
    text-align: center;
    font-size: 40px;
    position: absolute;
    top: 25vh;
    left: 0;
    right: 0;
    color: var(--btn-text);
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        margin-top: 20px;
        margin-left: 10px;
      }
    }

    .subtitle {
      margin-top: 40px;
      align-self: flex-center;
      width: var(--wid);
      white-space: nowrap;
      border-right: 2px solid transparent;
      overflow: hidden;
      font-size: 24px;
      font-family: consolas;

      &.typing-animation {
        animation:
          typing 3.2s steps(var(--num), end),
          blink-caret 0.75s step-end infinite;
      }

      @keyframes typing {
        from {
          width: 0;
        }

        to {
          width: var(--wid);
        }
      }

      @keyframes blink-caret {
        from,
        to {
          box-shadow: 1px 0 0 0 transparent;
        }

        50% {
          box-shadow: 1px 0 0 0;
        }
      }
    }
  }

  .version {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    margin-left: 40px;
    opacity: 0.8;

    span {
      font-size: 16px;
      color: var(--btn-text);
      font-family: consolas;
    }

    .link {
      cursor: pointer;
      margin-right: 20px;
      -webkit-app-region: no-drag;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.wave {
  position: absolute;
  width: calc(50vw + 500px);
  height: calc(100vh + 500px);
  opacity: 0.6;
  left: 0;
  top: 0;
  margin-left: -50%;
  margin-top: -30%;
  background: linear-gradient(744deg, #996633, var(--primary) 60%, #663399);
}

.wave:nth-child(2),
.wave:nth-child(3) {
  top: 210px;
}

.playing .wave {
  border-radius: 40%;
  animation: wave 3000ms infinite linear;
}

.wave {
  border-radius: 40%;
  animation: wave 55s infinite linear;
}

.playing .wave:nth-child(2) {
  animation-duration: 4000ms;
}

.wave:nth-child(2) {
  animation-duration: 50s;
}

.playing .wave:nth-child(3) {
  animation-duration: 5000ms;
}

.wave:nth-child(3) {
  animation-duration: 45s;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
