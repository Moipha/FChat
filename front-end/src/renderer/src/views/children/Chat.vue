<template>
  <Header :friend="friend" />
  <Friend :friend="friend" />
  <section>
    <div ref="msgContainer" class="msg-container scroll-bar" @wheel="throttledScroll">
      <!-- 不是最后一页时，显示获取消息按钮 -->
      <div v-if="!isLastPage" class="more" @click="throttledFunc">查看更多消息</div>
      <div v-for="(msg, index) in messages" :key="msg._id">
        <!-- 判断是否是同一天，不是则添加分隔条 -->
        <div
          v-if="index === 0 || needTime(messages[index - 1].createdTime, msg.createdTime)"
          class="date-separator"
        >
          {{ timeFormat(msg.createdTime, true) }}
        </div>

        <ChatMsg
          :position="msg.senderId === user._id ? 'right' : 'left'"
          :msg="msg.content"
          :user="msg.senderId === user._id ? user : friend"
          :read="new Date(lastReadAt) > new Date(msg.createdTime)"
        />
      </div>
    </div>
    <InputArea :friend="friend" :user="user" />
  </section>
</template>

<script lang="ts" setup>
import Header from '@r/components/layout/Header.vue'
import ChatMsg from '@r/components/form/ChatMsg.vue'
import Friend from '@r/components/layout/Friend.vue'
import InputArea from '@r/components/layout/InputArea.vue'
import { ref, nextTick, inject, onDeactivated, onActivated, onUnmounted } from 'vue'
import request from '@r/utils/request'
import { useUserStore } from '@r/stores/user'
import { useMsgStore } from '@r/stores/msg'
import { storeToRefs } from 'pinia'
import timeFormat from '@r/utils/timeFormat'
import bus from '@r/utils/bus'
import throttle from '@r/utils/throttle'

// 获取当前用户信息
const { user } = storeToRefs(useUserStore())
// 获取与该朋友的聊天记录
const { msgMap } = storeToRefs(useMsgStore())
// 路由参数：用户id
const props = defineProps(['id'])
// 接收socket
const socket = inject('socket')

// 接收服务器发来的消息
function receiveMsg() {
  socket.on('callback-msg', (savedMsg) => {
    messages.value.push(savedMsg)
    // 告诉aside更新最后一条消息
    bus.emit('update-aside', [savedMsg.content, friend.value._id, savedMsg.createdTime])
    // 滚动到底部
    nextTick(() => {
      scrollToBottom(true)
    })
  })
}

/**
 * 滚动条
 */

// 消息区滚动条滚动到底部
const msgContainer = ref(null)
function scrollToBottom(smooth) {
  if (msgContainer.value) {
    msgContainer.value.scrollTo({
      top: msgContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

// 滚动到底部事件
bus.on('bottom', () => {
  nextTick(() => {
    scrollToBottom(true)
  })
})
onUnmounted(() => {
  bus.off('bottom')
})
// 滚动到顶端，进行分页数据获取
function handleScroll() {
  // 不是最后一页时才获取
  if (!isLastPage.value) {
    getMessages()
  }
}
// 整合节流的滚动事件
const throttledFunc = throttle(handleScroll, 1000)
function throttledScroll(e) {
  // 到顶且向上滚动时，触发整合节流的滚动事件
  if (msgContainer.value.scrollTop === 0 && e.deltaY < 0) {
    throttledFunc()
  }
}

/**
 *工具函数
 */

// 判断是否需要添加时间
function needTime(time1, time2) {
  const date1 = new Date(time1)
  const date2 = new Date(time2)
  // 直接比较两个时间戳的差值是否大于等于30分钟
  return (
    date2 - date1 >= 30 * 60 * 1000 ||
    !(
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  )
}

/**
 * 请求发送
 */

// 聊天记录
const messages = ref([])
// 目标用户信息
const friend = ref({})
// 分页数据
const limit = ref(30)
// 下一次请求的lastId
const nextId = ref(null)
// 是否是最后一页
const isLastPage = ref(false)
// 载入时获取好友信息
async function getFriend() {
  const res = await request.get('/user', {
    params: { id: props.id }
  })
  if (res && res.code === 200) {
    friend.value = res.data
  }
  watchFriend()
}
// 监听好友状态
function watchFriend() {
  socket.on(friend.value._id, (status) => {
    console.log('朋友状态变了！', status)
    friend.value.status = status
  })
}
// 获取分页对话记录
async function getMessages() {
  const res = await request.get('/msg/both', {
    params: { friendId: props.id, limit: limit.value, nextId: nextId.value }
  })
  if (res && res.code === 200) {
    // 获取返回数据
    messages.value.unshift(...res.data.messages)
    nextId.value = res.data.nextId
    isLastPage.value = res.data.isLastPage
    // 记录当前滚动条与最下方的距离
    const height = msgContainer.value.scrollHeight - msgContainer.value.scrollTop
    nextTick(() => {
      // 恢复滚动条位置
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight - height
    })
    // 缓存消息
    msgMap.value[friend.value._id] = {
      messages: messages.value,
      nextId: res.data.nextId,
      isLastPage: res.data.isLastPage
    }
  }
}
async function load() {
  // 检查缓存，如有与该用户的聊天记录则直接加载，没有则发请求获取
  if (msgMap.value[friend.value._id]) {
    messages.value = msgMap.value[friend.value._id].messages
    nextId.value = msgMap.value[friend.value._id].nextId
    isLastPage.value = msgMap.value[friend.value._id].isLastPage
  } else {
    await getMessages()
  }
  // 获取完滚动到底部
  nextTick(() => {
    scrollToBottom(false)
  })
}

/**
 * 已读未读
 */

// 初始化时更新已读回执
function updateRead() {
  socket.emit('save-read', [user.value._id, friend.value._id])

  // 并绑定接收好友更新已读回执的通知
  socket.on('read', (time) => {
    lastReadAt.value = time
  })
}

// 好友最后已读时间
const lastReadAt = ref()

// 获取最后已读时间
async function getLastRead() {
  const res = await request.get('/read', {
    params: { friendId: friend.value._id }
  })
  if (res && res.code === 200) {
    lastReadAt.value = res.data
  }
}

// 从缓存队列中恢复时/载入时
onActivated(async () => {
  await getFriend()
  load()
  getLastRead()
  receiveMsg()
  updateRead()
})
onDeactivated(() => {
  // 解绑事件
  socket.off('callback-msg')
  socket.off(friend.value._id)
  socket.off('read')
})
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
    position: relative;

    .date-separator {
      text-align: center;
      margin: 10px 0;
      font-family: Consolas;
      color: var(--light-text);
      font-size: 14px;
    }

    .more {
      width: 100px;
      margin: 10px auto;
      text-align: center;
      font-size: 14px;
      color: var(--primary);
      transition: all 0.2s ease;
      font-weight: bold;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
