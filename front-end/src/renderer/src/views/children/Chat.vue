<template>
  <Header :friend="friend" />
  <section>
    <div ref="msgContainer" class="msg-container scroll-bar">
      <!-- 判断是否是同一天，不是则添加分隔条 -->
      <div v-for="(msg, index) in messages" :key="msg._id">
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
        />
      </div>
    </div>
    <div class="input-area">
      <Icon class="icon" name="link"></Icon>
      <Icon class="icon" name="emoji"></Icon>
      <Icon class="icon" :name="mode" @click="changeMsgMode"></Icon>
      <textarea
        v-if="mode === 'audio'"
        ref="textarea"
        v-model="newMsg"
        class="scroll-bar"
        rows="1"
        placeholder="请输入消息..."
        @keyup.enter="handleKeyup"
      />
      <Wave v-else class="wave" />
      <Icon class="icon send" name="send" @click="sendMessage"></Icon>
    </div>
  </section>
</template>

<script lang="ts" setup>
import Header from '@r/components/layout/Header.vue'
import Icon from '@r/components/form/Icon.vue'
import Wave from '@r/components/form/Wave.vue'
import ChatMsg from '@r/components/form/ChatMsg.vue'
import { ref, nextTick, inject, watch } from 'vue'
import request from '@r/utils/request'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import timeFormat from '@r/utils/timeFormat'

// 获取当前用户信息
const { user } = storeToRefs(useUserStore())
// 目标用户信息
const friend = ref({})
// 路由参数：用户id
const props = defineProps(['id'])
// 接收socket
const socket = inject('socket')

// 接收服务器发来的消息
socket.on('receive-msg', (savedMsg) => {
  messages.value.push(savedMsg)
  // 滚动到底部
  nextTick(() => {
    scrollToBottom(true)
  })
})
// 当前要发送的消息
const newMsg = ref('')
// 通过websocket发送消息
function sendMessage() {
  // 检查
  if (!checkMsg(newMsg.value)) return

  socket.emit('chat', {
    content: newMsg.value,
    senderId: user.value._id,
    receiverId: friend.value._id
  })
  newMsg.value = ''
}
// 输入框中按下回车
function handleKeyup(e) {
  // 如果没有同时按下shift键，则发送消息
  if (!e.shiftKey) {
    sendMessage()
  }
}
// 调整输入框的高度
const textarea = ref(null)
watch(newMsg, () => {
  nextTick(() => {
    textarea.value.style.height = 'inherit'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  })
})

// 聊天记录
const messages = ref([])

// 切换消息模式（语音/文字）
const mode = ref('audio')
function changeMsgMode() {
  if (mode.value === 'text') {
    mode.value = 'audio'
  } else {
    mode.value = 'text'
  }
}

// 对输入文本进行过滤
function checkMsg(msg) {
  if (msg.trim() !== '') {
    return true
  } else {
    return false
  }
}

// 载入时获取对话记录
async function getMessages() {
  const res = await request.get('/msg/both', { params: { friendId: props.id } })
  if (res && res.code === 200) {
    messages.value = res.data.messages
    friend.value = res.data.friend
  }
  // 滚动到底部
  nextTick(() => {
    scrollToBottom(false)
  })
  // 接收到friend后开始监听
  socket.on(friend.value._id, (status) => {
    console.log('朋友状态变了！', status)
    friend.value.status = status
  })
}
getMessages()

// 消息区滚动条滚动到底部
const msgContainer = ref(null)
function scrollToBottom(smooth) {
  msgContainer.value.scrollTo({
    top: msgContainer.value.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

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

    .date-separator {
      text-align: center;
      margin: 10px 0;
      font-family: Consolas;
      color: var(--light-text);
      font-size: 14px;
    }
  }

  .input-area {
    min-height: 50px;
    padding: 0 10px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: flex-end;
    transition: all 0.2s;

    .icon {
      font-size: 30px;
      color: var(--light-text);
      cursor: pointer;
      margin: 0 5px 10px;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }

    .send {
      margin-left: auto;
    }

    textarea {
      margin-left: 5px;
      background-color: transparent;
      padding-top: 12.5px;
      padding-bottom: 12.5px;
      height: 50px;
      max-height: 40vh;
      box-sizing: border-box;
      line-height: 25px;
      flex-grow: 1;
      border: none;
      outline: none;
      resize: none;
      color: var(--text);
      font-size: 16px;
      font-weight: 600;
      font-family: 'STXihei';
      letter-spacing: 1px;
      transition: all 0.2s;

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
