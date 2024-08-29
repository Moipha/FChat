<template>
  <section class="container">
    <Aside />
    <main>
      <router-view :key="$route.params.id" v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </main>
  </section>
  <Titlebar />
</template>

<script setup>
import Aside from '@r/components/layout/Aside.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
import config from '@/config'
import { io } from 'socket.io-client'
import { useUserStore } from '@r/stores/user'
import { useMsgStore } from '@r/stores/msg'
import { storeToRefs } from 'pinia'
import { provide, onBeforeUnmount } from 'vue'
import bus from '@r/utils/bus'
import audio from '@r/assets/audio/ballon.wav'

// 获取配置
const { PROTOCOL, PORT, IP } = config
// 获取当前用户信息
const { user, token } = storeToRefs(useUserStore())
// 建立socket连接
const socket = io(`${PROTOCOL}://${IP}:${PORT}`, {
  extraHeaders: {
    Authorization: token.value
  }
})
// 连接成功
socket.on('connect', () => {
  console.log('连接到服务器')
  socket.emit('login', user.value._id)
})

// 接收消息
socket.on('receive-msg', (msg) => {
  // 获取消息Map
  const { msgMap } = storeToRefs(useMsgStore())
  // 更新对应的消息列表
  if (msgMap.value[msg.senderId]) {
    msgMap.value[msg.senderId].messages.push(msg)
  } else {
    msgMap.value[msg.senderId] = {
      messages: [msg],
      isLastPage: true,
      nextId: msg._id
    }
  }
  // 通知ChatList更新
  bus.emit('receive-msg', msg)
  // 播放提示音
  const au = new Audio(audio)
  au.play().catch((error) => {
    console.error('提示音播放失败:', error)
  })
})

// 注入socket
provide('socket', socket)

// 结束监听
onBeforeUnmount(() => {
  socket.off('connect')
  socket.off('receive-msg')
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100vw;

  main {
    display: flex;
    position: relative;
    flex: 1;
    min-width: 400px;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bg);
    transition: 0.2s all;
  }
}
</style>
