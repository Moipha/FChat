<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
import emoji from '@r/../public/emoji'
import AudioMsg from '@r/components/form/AudioMsg.vue'
import FileMsg from '@r/components/form/FileMsg.vue'

defineProps({
  position: {
    type: String,
    default: 'left'
  },
  msg: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  user: {
    type: Object,
    default: () => {}
  },
  read: {
    type: Boolean
  },
  type: {
    type: String,
    default: 'text'
  },
  file: {
    type: Object,
    default: () => {}
  }
})

function parseMsg(msg) {
  const regex = /#\[([^\]]*)\]/g
  const result = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(msg)) !== null) {
    // 添加之前的普通文本部分
    if (match.index > lastIndex) {
      result.push({ type: 'text', content: msg.slice(lastIndex, match.index) })
    }
    // 查找表情并添加
    const emojiUrl = emoji.map[match[1]]
    if (emojiUrl) {
      result.push({ type: 'emoji', content: emoji.path + emojiUrl })
    } else {
      // 如果表情不存在，则保持原文本
      result.push({ type: 'text', content: match[0] })
    }
    lastIndex = regex.lastIndex
  }
  // 添加剩余的文本
  if (lastIndex < msg.length) {
    result.push({ type: 'text', content: msg.slice(lastIndex) })
  }
  return result
}
</script>

<template>
  <div
    class="chat-msg"
    :class="position"
    :style="{ flexDirection: position === 'left' ? 'row' : 'row-reverse' }"
  >
    <Avatar :src="user.avatar" class="avatar" shape="circle" :size="40" />
    <div class="msg-box">
      <!-- 文本消息 -->
      <template v-if="type === 'text'">
        <span v-for="(part, index) in parseMsg(msg)" :key="index">
          <template v-if="part.type === 'text'">
            {{ part.content }}
          </template>
          <template v-else-if="part.type === 'emoji'">
            <img :src="part.content" alt="emoji" width="30" height="30" />
          </template>
        </span>
      </template>
      <!-- 音频消息 -->
      <template v-else-if="type === 'audio'">
        <AudioMsg :src="msg" :position="position" />
      </template>
      <template v-else-if="type === 'file'">
        <FileMsg :file="file" :position="position" />
      </template>
    </div>
    <div class="read" :class="read ? 'already' : 'yet'">
      {{ position === 'right' ? (read ? '已读' : '未读') : '' }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-msg {
  padding: 10px 0;
  overflow: hidden;
  display: flex;

  .read {
    font-weight: bolder;
    margin-right: 5px;
    align-self: flex-end;
    font-size: 12px;

    &.already {
      color: var(--primary);
    }

    &.yet {
      color: var(--error);
    }
  }

  .msg-box {
    max-width: 60%;
    word-wrap: break-word;
    padding: 7px 10px;
    box-sizing: border-box;
    position: relative;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s ease;
    user-select: text;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 25px;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      border-top: 6px transparent solid;
      transition: all 0.2s;
    }
  }

  .avatar {
    align-self: flex-end;
    margin: 0 10px;
  }

  &.left {
    .msg-box {
      border-radius: 5px 5px 5px 0;
      background-color: var(--border);
      color: var(--text);

      &::before {
        left: -6px;
        border-bottom: 6px var(--border) solid;
        border-left: 6px transparent solid;
        border-right: 6px var(--border) solid;
      }

      span::selection,
      img::selection {
        background-color: var(--primary);
        color: var(--btn-text);
      }
    }
  }

  &.right {
    .msg-box {
      border-radius: 5px 5px 0 5px;
      background-color: var(--primary);
      color: var(--btn-text);

      &::before {
        right: -6px;
        border-bottom: 6px var(--primary) solid;
        border-left: 6px var(--primary) solid;
        border-right: 6px transparent solid;
      }

      span::selection,
      img::selection {
        background-color: var(--bg);
        color: var(--text);
      }
    }
  }
}
</style>
<style>
.msg-box {
  img {
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
}
</style>
