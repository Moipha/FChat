<template>
  <Header :name="id" />
  <section>
    <div class="msg-container">
      <ChatMsg :position="'right'" />
      <ChatMsg :position="'left'" />
    </div>
    <div class="input-area">
      <Icon class="icon" name="link"></Icon>
      <Icon class="icon" name="emoji"></Icon>
      <Icon class="icon" :name="mode" @click="changeMsgMode"></Icon>
      <input v-if="mode === 'audio'" placeholder="请输入消息..." />
      <Wave v-else class="wave" />
      <Icon class="icon send" name="send"></Icon>
    </div>
  </section>
</template>

<script lang="ts" setup>
import Header from '@r/components/layout/Header.vue'
import Icon from '@r/components/form/Icon.vue'
import Wave from '@r/components/form/Wave.vue'
import ChatMsg from '@r/components/form/ChatMsg.vue'
import { ref } from 'vue'

defineProps(['id'])

// 切换消息模式（语音/文字）
const mode = ref('audio')
function changeMsgMode() {
  if (mode.value === 'text') {
    mode.value = 'audio'
  } else {
    mode.value = 'text'
  }
}
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);

  .msg-container {
    flex: 1;
    background-color: var(--bg);
    transition: all 0.2s;
  }
  .input-area {
    height: 50px;
    padding: 0 10px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    transition: all 0.2s;
    .icon {
      font-size: 30px;
      color: var(--light-text);
      cursor: pointer;
      margin-right: 10px;
      transition: all 0.2s ease;
      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }
    .send {
      margin-left: auto;
    }
    input {
      margin-left: 5px;
      height: 45px;
      flex: 1;
      color: var(--text);
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 16px;
      letter-spacing: 1px;
      &::selection {
        background-color: var(--primary);
        color: var(--btn-text);
      }
      &::placeholder {
        opacity: 0.7;
      }
    }
    .wave {
      margin: auto;
    }
  }
}
</style>
