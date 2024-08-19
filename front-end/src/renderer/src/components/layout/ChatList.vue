<template>
  <nav ref="navBar" class="nav scroll-bar" @scroll="handleScroll" @click="selectChat">
    <div
      v-for="item in list"
      :key="item.id"
      :class="{ active: item.id === activeItem }"
      :data="item.id"
      class="chat-list"
    >
      <Avatar :src="item.avatar" shape="circle" />
      <div class="msg-box">
        <div class="name">{{ item.name }}</div>
        <div class="msg dyh">{{ item.msg }}</div>
      </div>
      <div class="time-box">{{ timeFormat(item.createdTime) }}</div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import Avatar from '@r/components/form/Avatar.vue'
import timeFormat from '@r/utils/timeFormat'
import router from '@r/router'
import request from '@r/utils/request'
import { useRoute } from 'vue-router'
import bus from '@r/utils/bus'
import { useMsgStore } from '@r/stores/msg'
import { storeToRefs } from 'pinia'

// 获取消息Map
const { msgMap } = storeToRefs(useMsgStore())

/**
 * socket
 */
const socket = inject('socket')
// 接收到非当前好友的新消息，标记未读，更新最后消息
socket.on('receive-msg', (msg) => {
  updateAside([msg.content, msg.senderId, msg.createdTime])
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
  // 如果是正在聊天的，滚动到底部，同时更新已读时间
  if (msg.senderId === activeItem.value) {
    bus.emit('bottom')
    socket.emit('save-read', [msg.receiverId, msg.senderId])
  }
})

/**
 * 列表数据获取
 */
const list = ref([])
async function getList() {
  const res = await request.get('/user/aside')
  list.value = res.data
}
getList()

/**
 * 打开对应聊天界面
 */
function selectChat(e) {
  let cur = e.target
  // 通过代理事件减少绑定事件的数量
  while (cur && cur.offsetParent) {
    if (cur.className === 'chat-list') {
      break
    }
    cur = cur.offsetParent
  }
  const key = cur.attributes.data
  if (key) {
    // 设置生效的item
    activeItem.value = key.value
    // 跳转到对应路由
    router.push('/chat/' + key.value)
  }
}
// 记录生效的item
const activeItem = ref(null)
// 初始加载时从路由获取当前item
const route = useRoute()
activeItem.value = route.params.id
/**
 * 滚动条事件
 */
const navBar = ref(null)

const handleScroll = () => {
  if (navBar.value) {
    // 检查滚动条是否在顶端
    if (navBar.value.scrollTop > 0) {
      // 如果不在顶端，添加add-border类
      navBar.value.classList.add('add-border')
    } else {
      // 如果在顶端，移除add-border类
      navBar.value.classList.remove('add-border')
    }
  }
}

onMounted(() => {
  // 挂载完成后添加滚动事件监听
  if (navBar.value) {
    navBar.value.addEventListener('scroll', handleScroll)
  }
})

/**
 * 更新最后一条消息
 */
bus.on('update-aside', updateAside)
function updateAside([content, id, time]) {
  const targetIndex = list.value.findIndex((item) => item.id === id)
  // 检查是否找到了对应的item
  if (targetIndex === -1) return
  // 获取对应的item
  const target = list.value[targetIndex]
  // 更新内容
  target.msg = content
  target.createdTime = time
  // 如果该item不是第一个，则将其提到最前面
  if (targetIndex !== 0) {
    // 移除原来的item，然后将其添加到数组前面
    list.value = [target, ...list.value.slice(0, targetIndex), ...list.value.slice(targetIndex + 1)]
  }
}

onBeforeUnmount(() => {
  bus.off('update-aside')
  socket.off('receive-msg')
})
</script>

<style lang="scss" scoped>
.nav {
  height: calc(100vh - 60px);
  transition: border 0.2s;
  border-top: 1px solid transparent;

  .chat-list {
    height: 64px;
    width: calc(100% - 20px);
    padding: 0 10px 0 10px;
    background-color: var(--bg);
    display: flex;
    position: relative;
    transition:
      0.2s all,
      0s width;
    cursor: pointer;

    img {
      align-self: center;
    }

    &:hover {
      background-color: var(--border);
    }

    .msg-box {
      display: flex;
      flex-direction: column;
      padding: 10px;
      justify-content: space-between;
      width: calc(100% - 64px);
      white-space: nowrap;

      .name {
        font-size: 15px;
        color: var(--text);
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        width: calc(100% - 64px);
        transition: color 0.2s;
      }

      .msg {
        font-size: 13px;
        color: var(--light-text);
        text-overflow: ellipsis;
        overflow: hidden;
        width: calc(100% - 30px);
        transition: color 0.2s;
      }
    }

    .time-box {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 14px;
      color: var(--light-text);
      font-family: 'consolas';
      transition: color 0.2s;
    }
  }

  .active {
    background-color: var(--primary);
    --text: var(--btn-text);
    --light-text: var(--btn-text);

    &:hover {
      background-color: var(--primary);
      color: var(--btn-text);
    }
  }
}
</style>
