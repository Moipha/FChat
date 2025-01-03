<script lang="ts" setup>
import emoji from '@r/../public/emoji'
import { ref, inject } from 'vue'
import Wave from '@r/components/form/Wave.vue'
import Uploader from '@r/components/layout/Uploader.vue'

// 接收socket
const socket = inject('socket')
// 接受用户信息
const props = defineProps({
  friend: {
    type: Object,
    default: () => ({})
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

/**
 * 发送消息
 */

// 当前要发送的消息
const newMsg = ref('')
// 通过websocket发送消息
function sendMessage(friendId) {
  // 检查
  if (!checkMsg(newMsg.value)) return
  socket.emit('chat', {
    content: newMsg.value,
    senderId: props.user._id,
    receiverId: friendId,
    type: 'text'
  })
  newMsg.value = ''
  textarea.value.innerHTML = ''
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
function handleKeyup(id, e) {
  // 如果没有同时按下shift键，则发送消息
  if (!e.shiftKey) {
    e.preventDefault()
    sendMessage(id)
  }
}

/**
 * 输入框调整
 */

// 输入框
const textarea = ref(null)

// 输入框变动
function handleInput(event) {
  newMsg.value = restoreHtmlEntities(htmlToText(event.target.innerHTML))
}
// 将图片的html替换为文本
function htmlToText(html) {
  return html.replace(/<img [^>]*alt="([^"]+)"[^>]*>/g, (match, data) => {
    return `#[${data}]`
  })
}
function handleDrop(e) {
  e.preventDefault() // 阻止默认的拖动行为

  // 检查是否有 HTML 数据
  const htmlData = e.dataTransfer?.getData('text/html')
  const plainText = e.dataTransfer?.getData('text/plain')

  if (htmlData) {
    // 解析HTML并提取其中的文本内容
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlData, 'text/html')
    const textContent = doc.body.textContent || ''
    // 将提取的文本内容插入到光标位置
    insertTextAtCursor(textContent)
  } else if (plainText) {
    // 如果没有 HTML 数据，则使用纯文本
    insertTextAtCursor(plainText)
  }
}

function handlePaste(e) {
  e.preventDefault() // 阻止默认的粘贴行为
  // 获取粘贴板中的文本内容
  const text = e.clipboardData?.getData('text/plain')
  if (text) {
    // 将纯文本插入到光标位置
    insertTextAtCursor(text)
  }
}
function insertTextAtCursor(text) {
  const selection = window.getSelection()
  if (!selection?.rangeCount) return

  const range = selection.getRangeAt(0)
  range.deleteContents() // 删除选中的内容（如果有）

  const textNode = document.createTextNode(text)
  range.insertNode(textNode)

  // 将光标移动到文本的末尾
  range.setStartAfter(textNode)
  range.setEndAfter(textNode)
  selection.removeAllRanges()
  selection.addRange(range)

  // 更新 newMsg.value 的值
  newMsg.value = htmlToText(textarea.value.innerHTML)
}

// 切换消息模式（语音/文字）
const mode = ref('audio')
function changeMsgMode() {
  if (mode.value === 'text') {
    mode.value = 'audio'
  } else {
    mode.value = 'text'
    newMsg.value = ''
    textarea.value.innerHTML = ''
  }
}

/**
 * 表情窗口
 */
// 打开表情窗口
function showEmoji() {
  window.api.openDialog({
    route: '/emoji',
    height: 420,
    width: 520,
    closeOnBlur: true
  })
  // 聚焦textarea
  textarea.value.focus()
}
// 接收表情
function bindReceiveEmoji() {
  if (window.api && window.api.receiveEmoji) {
    window.api.receiveEmoji((id) => {
      newMsg.value += `#[${id}]`
      const imgTag = document.createElement('img')
      imgTag.src = `${emoji.path}${emoji.map[id]}`
      imgTag.alt = id

      // 获取当前的光标位置
      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      // 删除当前选中的内容
      range.deleteContents()

      // 插入图片节点
      range.insertNode(imgTag)

      // 更新 Range 对象，移动光标到图片之后
      range.setStartAfter(imgTag)
      range.setEndAfter(imgTag)

      // 清空当前selection，并重新设置新的 range
      selection.removeAllRanges()
      selection.addRange(range)

      // 聚焦textarea
      setTimeout(() => {
        textarea.value.focus()
      }, 0)
    })
  }
}
bindReceiveEmoji()
// 聚焦textarea
setTimeout(() => {
  textarea.value.focus()
}, 0)

/**
 * 上传文件
 */
const uploader = ref(null)

function openUpload() {
  uploader.value.openUpload()
}

/**
 * 工具函数
 */
// 对输入文本进行过滤
function checkMsg(msg) {
  if (msg.trim() !== '') {
    return true
  } else {
    return false
  }
}
</script>

<template>
  <div class="input-area">
    <Uploader ref="uploader" :friend-id="friend._id" :user-id="user._id" />
    <Icon class="icon" name="link" @click="openUpload" />
    <Icon class="icon" name="emoji" @click="showEmoji" />
    <Icon class="icon" :name="mode" @click="changeMsgMode" />
    <div
      v-if="mode === 'audio'"
      ref="textarea"
      spellcheck="false"
      contenteditable="true"
      class="scroll-bar input"
      @input="handleInput"
      @keydown.enter="handleKeyup(friend._id, $event)"
      @paste="handlePaste"
      @drop="handleDrop"
    />
    <Wave v-else :user="user" :friend="friend" class="wave" />
    <span v-if="mode === 'audio' && (newMsg === '' || newMsg === '\n')" class="placeholder"
      >请输入消息...</span
    >
    <Icon
      v-if="mode === 'audio'"
      class="icon send"
      name="send"
      @click="sendMessage(friend._id)"
    ></Icon>
  </div>
</template>

<style lang="scss" scoped>
.input-area {
  min-height: 50px;
  padding: 0 10px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
  transition: all 0.2s;
  font-family: Microsoft YaHei;

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
    left: 135px;
    bottom: 15px;
    z-index: 1;
    color: var(--light-text);
    opacity: 0.8;
    user-select: none;
  }

  .wave {
    margin: auto;
  }
}
</style>
<style>
.input {
  img {
    height: 30px;
    width: 30px;
    vertical-align: middle;

    &::selection {
      background-color: var(--primary);
      color: var(--btn-text);
    }
  }
}
</style>
