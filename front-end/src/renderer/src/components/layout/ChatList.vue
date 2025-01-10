<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject, nextTick } from 'vue'
import Avatar from '@r/components/form/Avatar.vue'
import { getNormal } from '@r/utils/timeFormat'
import router from '@r/router'
import bus from '@r/utils/bus'
import { useSettingStore } from '@r/stores/setting'
import { useUserStore } from '@r/stores/user'
import { VueDraggable } from 'vue-draggable-plus'
import { storeToRefs } from 'pinia'
import { RSAEncryption, AESEncryption } from '@r/utils/cryptoUtils'

const { routeMap } = useSettingStore()
const { chatList, user } = storeToRefs(useUserStore())
/**
 * socket
 */
const socket = inject('socket')

// 接收到非当前好友的新消息，标记未读，更新最后消息
bus.on('receive-msg', (msg) => {
  updateAside(msg)
  // 如果是正在聊天的，滚动到底部，同时更新已读时间
  if (msg.senderId === activeItem.value) {
    bus.emit('bottom')
    socket.emit('save-read', [msg.receiverId, msg.senderId])
  }
})
/**
 * 打开对应聊天界面
 */
function selectChat(e) {
  let cur = e.target
  // 通过代理事件减少绑定事件的数量
  while (cur && cur.offsetParent) {
    if (cur.className.slice(0, 9) === 'chat-list') {
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
    // 记录当前路径
    routeMap['chat'] = '/chat/' + key.value
  }
}
// 记录生效的item
const activeItem = ref(null)

// 初始加载时从路由获取当前item
activeItem.value = routeMap['chat'] ? routeMap['chat'].slice(6) : null

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

// 可供渲染的chatList
const renderChatList = ref([])

onMounted(async () => {
  // 挂载完成后添加滚动事件监听
  if (navBar.value) {
    navBar.value.addEventListener('scroll', handleScroll)
  }
  await decryptMsg()
})

// 解密加密的消息
async function decryptMsg() {
  renderChatList.value = []
  // 获取每个聊天条目的消息
  for (const item of chatList.value) {
    const msg = await getMsg(item.msg, item.encryptedKey, item.type)
    renderChatList.value.push({ ...item, msg })
  }
}

/**
 * 更新侧边栏消息
 */
bus.on('update-aside', updateAside)
async function updateAside(msg) {
  const decryptedKey = msg.senderId === user.value._id ? msg.encryptBySender : msg.encryptByReceiver
  const targetIndex = chatList.value.findIndex((item) => item.id === msg.receiverId)
  // 检查是否找到了对应的item
  if (targetIndex === -1) return
  // 获取对应的item
  const target = chatList.value[targetIndex]
  // 更新内容
  target.createdTime = msg.createdTime
  // 获取renderChatList中的对应item
  const targetRenderIndex = renderChatList.value.findIndex((item) => item.id === msg.receiverId)
  // 解密
  const decryptedMsg = await getMsg(msg.content, decryptedKey, msg.type)
  // 如果该item不是第一个，则将其提到最前面
  if (targetRenderIndex !== -1) {
    // 移除原来的item，然后将其添加到数组前面
    renderChatList.value = [
      { ...target, msg: decryptedMsg },
      ...renderChatList.value.slice(0, targetRenderIndex),
      ...renderChatList.value.slice(targetRenderIndex + 1)
    ]
  }
}

// 拖拽相关
const drag = ref(false)
function onStart() {
  drag.value = true
}
function onEnd() {
  nextTick(() => {
    drag.value = false
  })
}

onBeforeUnmount(() => {
  bus.off('update-aside')
  bus.off('receive-msg')
})

/**
 * 工具函数
 */
async function getMsg(encryptedMsg, encryptedKey, type) {
  let res
  if (type === 'text') {
    // 如果是文本消息，则解密后返回
    const privateKey = await RSAEncryption.getPrivateKey()
    const RSA = await RSAEncryption.create(user.value.publicKey, privateKey)
    // 获取AES密钥
    const key = await RSA.decrypt(encryptedKey)
    const AES = await AESEncryption.create(key)
    res = await AES.decrypt(encryptedMsg)
  } else if (type === 'audio') {
    res = '[语音消息]'
  } else if (type === 'img') {
    res = '[图片消息]'
  } else if (type === 'video') {
    res = '[视频消息]'
  } else if (type === 'file') {
    res = '[文件]'
  } else {
    res = ''
  }
  return res
}
</script>

<template>
  <nav ref="navBar" class="nav scroll-bar" @scroll="handleScroll" @click="selectChat">
    <VueDraggable
      v-model="renderChatList"
      :animation="150"
      ghost-class="ghost"
      @start="onStart"
      @end="onEnd"
    >
      <TransitionGroup type="transition" :name="!drag ? 'fade' : undefined">
        <div
          v-for="item in renderChatList"
          :key="item.id"
          :class="{ active: item.id === activeItem }"
          :data="item.id"
          class="chat-list no-transition"
        >
          <Avatar :src="item.avatar" shape="circle" />
          <div class="msg-box">
            <div class="name">{{ item.name }}</div>
            <div class="msg dyh">{{ item.msg }}</div>
          </div>
          <div class="time-box">{{ getNormal(item.createdTime) }}</div>
        </div>
      </TransitionGroup>
    </VueDraggable>
    <div v-if="!renderChatList.length" class="empty">
      <Icon class="icon" name="empty" />
      <span>暂无对话</span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  height: calc(100vh - 60px);
  transition: border 0.2s;
  border-top: 1px solid transparent;

  .empty {
    padding: 10px 25px;
    font-size: 16px;
    color: var(--text);
    height: 85%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: bolder;
    font-size: 20px;
    font-family: microsoft yahei;

    .icon {
      font-size: 36px;
    }
  }

  .chat-list {
    height: 64px;
    width: calc(100% - 20px);
    padding: 0 10px 0 10px;
    background-color: var(--bg);
    display: flex;
    position: relative;
    cursor: pointer;

    img {
      align-self: center;
    }

    &:hover {
      background-color: var(--hover);
    }

    .msg-box {
      display: flex;
      flex-direction: column;
      padding: 10px;
      justify-content: space-between;
      width: calc(100% - 64px);
      white-space: nowrap;

      .name {
        font-size: 14px;
        color: var(--text);
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        width: calc(100% - 72px);
      }

      .msg {
        font-size: 13px;
        color: var(--light-text);
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        margin-bottom: 2px;
      }
    }

    .time-box {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 14px;
      color: var(--light-text);
      font-family: 'consolas';
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

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

.ghost {
  transition: opacity 0.2s;
  opacity: 0.5;
}
</style>
