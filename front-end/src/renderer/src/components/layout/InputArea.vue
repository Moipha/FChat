<template>
  <div class="input-area">
    <Icon class="icon" name="link" />
    <Icon class="icon" name="emoji" @click="showEmoji" />
    <Icon class="icon" :name="mode" @click="changeMsgMode" />
    <div
      v-if="mode === 'audio'"
      ref="textarea"
      contenteditable="true"
      class="scroll-bar input"
      @input="handleInput"
      @keydown.enter="handleKeyup"
      @paste="handlePaste"
      @drop="handleDrop"
    />
    <Wave v-else class="wave" />
    <Icon class="icon send" name="send" @click="sendMessage"></Icon>
  </div>
</template>

<script lang="ts" setup>
import emoji from '@r/assets/emoji'
import { ref, onActivated } from 'vue'
import Icon from '@r/components/form/Icon.vue'
import Wave from '@r/components/form/Wave.vue'

// 接受用户信息
const { user, socket, friend } = defineProps({
  friend: {
    type: Object,
    default: () => ({})
  },
  user: {
    type: Object,
    default: () => ({})
  },
  socket: {
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
function sendMessage() {
  // 检查
  if (!checkMsg(newMsg.value)) return
  socket.emit('chat', {
    content: newMsg.value,
    senderId: user._id,
    receiverId: friend._id
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
function handleKeyup(e) {
  // 如果没有同时按下shift键，则发送消息
  if (!e.shiftKey) {
    e.preventDefault()
    sendMessage()
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
    shadow: false,
    close: false,
    modal: false,
    height: 400,
    width: 500,
    emoji: true
  })
}
// 接收表情
function bindReceiveEmoji() {
  if (window.api.receiveEmoji) {
    window.api.receiveEmoji((id) => {
      newMsg.value += `#[${id}]`
      const imgTag = `<img src="${emoji.path}${emoji.map[id]}" alt="${id}" />`
      textarea.value.innerHTML += imgTag
      setTimeout(() => {
        // 聚焦
        textarea.value.focus()
        // 创建一个 Range 对象
        const range = document.createRange()
        // 选择 contenteditable 元素的文本内容
        const selection = window.getSelection()
        // 将 Range 对象的起始位置和结束位置设置到文本内容的末尾
        range.selectNodeContents(textarea.value)
        range.collapse(false)
        // 将 Range 对象应用到当前的 Selection
        selection.removeAllRanges()
        selection.addRange(range)
      }, 0)
    })
  }
}
bindReceiveEmoji()

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

<style lang="scss" scoped>
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

  .input {
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
    font-size: 16px;
    font-weight: 600;
    font-family: 'STXihei';
    letter-spacing: 1px;
    transition: all 0.2s;

    &::selection {
      background-color: var(--primary);
      color: var(--btn-text);
    }
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
