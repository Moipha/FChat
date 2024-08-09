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
import { storeToRefs } from 'pinia'
import { provide } from 'vue'

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
socket.on('connect', () => {
  console.log('连接到服务器')
  socket.emit('login', user.value._id)
})
// 注入socket
provide('socket', socket)
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100vw;

  main {
    display: flex;
    flex: 1;
    min-width: 400px;
    overflow: hidden;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bg);
    transition: 0.2s all;
  }
}
</style>
