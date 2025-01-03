<script lang="ts" setup>
import Header from '@r/components/layout/Header.vue'
import ChatMsg from '@r/components/form/ChatMsg.vue'

import { ref, onActivated, computed, nextTick } from 'vue'
import request from '@r/utils/request'
import { useUserStore } from '@r/stores/user'
import { useMsgStore } from '@r/stores/msg'
import { useSocketStore } from '@r/stores/socket'
import { storeToRefs } from 'pinia'
import bus from '@r/utils/bus'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// 获取当前用户信息
const { user } = storeToRefs(useUserStore())
// 获取socket
const { webSocket, newAiMsg } = storeToRefs(useSocketStore())
// 设置socket状态监听
webSocket.value.onWillStatusChange = function (old, status) {
  iconName.value = iconMap.get(status)
}
// 设置结束事件
webSocket.value.onWillClose = async function () {
  await request.post('/bot/msg', {
    content: newAiMsg.value.content,
    botId: bot.value._id,
    receiverId: user.value._id
  })
  messages.value.push({ ...newAiMsg.value })
  newAiMsg.value.content = ''
}

// 发送图标
const iconName = ref('send')

const iconMap = new Map([
  ['ttsing', 'loading'],
  ['init', 'send']
])

/**
 * 信息
 */

// 对话信息
const bot = ref({
  _id: props.id,
  title: '新建对话'
})

// 消息列表
const messages = ref([])
// messages -> texts
const texts = computed(() => {
  return messages.value.map((msg) => {
    return {
      role: msg.senderId === user.value._id ? 'user' : 'assistant',
      content: msg.content
    }
  })
})
/**
 * 分页
 */
// 分页数据
const limit = ref(30)
// 下一次请求的lastId
const lastId = ref(null)
// 是否是最后一页
const isLastPage = ref(true)

/**
 * 输入框相关
 */
const newMsg = ref('')
const textarea = ref(null)
// 输入框变动
function handleInput(event) {
  newMsg.value = restoreHtmlEntities(event.target.innerHTML)
}
// 处理符号
function restoreHtmlEntities(html) {
  // 替换 &nbsp; 为普通空格
  html = html.replace(/&nbsp;/g, ' ')
  // 替换 <br> 为换行符
  html = html.replace(/<br\s*\/?>/g, '\n')
  return html
}

// 输入框中按下回车
function handleKeyup(e) {
  // 如果没有同时按下shift键，则发送消息
  if (!e.shiftKey) {
    e.preventDefault()
    beforeSend()
  }
}
function beforeSend() {
  // 非init状态，不发送消息
  if (webSocket.value.status !== 'init') return
  // 如果是第一次发送，调用对应的函数
  if (messages.value.length <= 0) {
    firstSend()
  } else {
    sendMessage()
  }
}

/**
 * 请求发送
 */

// 获取bot信息
async function getBotInfo() {
  const res = await request.get('/bot', {
    params: {
      botId: bot.value._id
    }
  })
  if (res && res.code === 200) {
    bot.value = res.data
  }
}

// 初次发送消息
async function firstSend() {
  // 初次发送消息，则先创建对话，然后保存消息
  const res = await request.post('/bot', { title: bot.value.title })
  if (res && res.code === 200) {
    bot.value = res.data
  }
  // 发送消息
  await sendMessage()
  // ai生成本次聊天标题
  const aiTitle = await webSocket.value.start(
    [
      ...texts.value,
      {
        role: 'user',
        content:
          '请为这段对话生成一个简洁、准确且不超过15个字的标题，我会将你的回答直接作为标题，仅返回可直接使用的标题部分，不用携带任何附加信息，不能在回答上带引号，不能有任何多余解释，直接返回标题即可，不用解释你为什么取这个标题！！！！！对话标题如下：'
      }
    ],
    true
  )
  bot.value.title = aiTitle
  // 更新bot信息
  await request.put('/bot', { title: bot.value.title, botId: bot.value._id })
  // 更新左边栏
  bus.emit('update-list')

  // 跳转至具体页面
  bus.emit('select-bot', bot.value._id)
  // 重置页面
  reset()
}
function reset() {
  messages.value = []
  bot.value = {
    _id: props.id,
    title: '新建对话'
  }
}

// 发送消息
async function sendMessage() {
  // 临时存储输入框中的内容
  let curMsg = newMsg.value
  // 清空输入框
  newMsg.value = ''
  textarea.value.innerHTML = ''
  // 添加用户发送的消息
  messages.value.push({
    senderId: user.value._id,
    content: curMsg
  })
  // 保存消息
  await request.post('/bot/msg', {
    content: curMsg,
    botId: bot.value._id,
    senderId: user.value._id
  })
  // 通过socket向ai所在服务器获取回复
  await webSocket.value.start([...texts.value, { role: 'user', content: curMsg }])
}
// 获取消息列表
async function getMessages() {
  const res = await request.get('/bot/page', {
    params: {
      botId: bot.value._id,
      limit: limit.value,
      lastId: lastId.value
    }
  })
  if (res && res.code === 200) {
    // 获取返回数据
    messages.value.unshift(...res.data.messages)
    lastId.value = res.data.lastId
    isLastPage.value = res.data.isLastPage
  }
  // 获取完滚动到底部
  nextTick(() => {
    scrollToBottom(false)
  })
}

/**
 * 滚动
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

onActivated(async () => {
  if (props.id === 'new') return
  await getBotInfo()
  getMessages()
})
</script>

<template>
  <Header :bot="true" :bot-title="bot.title" />
  <section>
    <div v-if="bot._id === 'new' && messages.length === 0" class="container">
      <Icon class="icon" name="bot" />
      <span>有什么可以帮忙的？</span>
    </div>
    <div v-else ref="msgContainer" class="msg-container scroll-bar">
      <!-- 不是最后一页时，显示获取消息按钮 -->
      <div v-if="!isLastPage" class="more" @click="throttledFunc">查看更多消息</div>
      <div v-for="msg in messages" :key="msg._id" class="msg">
        <Icon v-if="msg.senderId !== user._id" class="avatar" name="bot" />
        <ChatMsg
          :position="msg.senderId === user._id ? 'right' : 'left'"
          :msg="msg.content"
          :user="user"
          :read="null"
          :avatar="msg.senderId === user._id"
        />
      </div>
      <div v-if="newAiMsg.content !== ''" class="msg">
        <Icon class="avatar" name="bot" />
        <ChatMsg
          position="left"
          :msg="newAiMsg.content"
          :user="user"
          :read="null"
          :avatar="false"
        />
      </div>
    </div>
    <div class="input-area">
      <div
        ref="textarea"
        class="input scroll-bar"
        spellcheck="false"
        contenteditable="true"
        @input="handleInput"
        @keydown.enter="handleKeyup($event)"
      />
      <span v-if="newMsg === '' || newMsg === '\n'" class="placeholder">请输入消息...</span>
      <Icon class="right-icon" :name="iconName" @click="beforeSend" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  color: var(--text);
  transition: all 0.2s ease;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 20px;
    color: var(--text);
    font-weight: bold;
    font-family: Microsoft YaHei;
    filter: brightness(0.95);
    background-color: var(--bg);

    .icon {
      margin-right: 10px;
      font-size: 30px;
    }
  }
  .msg-container {
    flex: 1;
    background-color: var(--bg);
    transition: all 0.2s ease;
    position: relative;
    padding: 5px 0 5px 40px;
    filter: brightness(0.95);

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

    .msg {
      position: relative;

      .avatar {
        position: absolute;
        left: -27.5px;
        bottom: 15px;
        font-size: 30px;
      }
    }
  }
}
.input-area {
  min-height: 50px;
  padding: 0 10px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
  transition: all 0.2s;
  font-family: Microsoft YaHei;
  background-color: var(--bg);

  .input {
    display: relative;
    z-index: 2;
    margin-left: 5px;
    background-color: transparent;
    padding-top: 10px;
    padding-bottom: 10px;
    max-height: 40vh;
    box-sizing: border-box;
    line-height: 30px;
    flex-grow: 1;
    border: none;
    outline: none;
    color: var(--text);
    font-size: 15px;
    transition: all 0.2s;

    &::selection {
      background-color: var(--primary);
      color: var(--btn-text);
    }
  }

  .placeholder {
    position: absolute;
    left: 15px;
    bottom: 15px;
    z-index: 1;
    color: var(--light-text);
    opacity: 0.8;
    user-select: none;
  }

  .left-icon {
    font-size: 25px;
    margin-bottom: 12.5px;
  }
  .right-icon {
    font-size: 30px;
    margin-bottom: 10px;
    margin-right: 5px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--light-text);

    &:hover {
      color: var(--primary);
      scale: 1.1;
    }
  }
}
</style>
