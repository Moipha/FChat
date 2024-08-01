<template>
  <div
    class="chat-msg"
    :class="position"
    :style="{ flexDirection: position === 'left' ? 'row' : 'row-reverse' }"
  >
    <Avatar :src="user.avatar" class="avatar" shape="circle" :size="40" />
    <div class="msg-box">{{ msg }}</div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
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
  }
})
</script>

<style lang="scss" scoped>
.chat-msg {
  padding: 10px 0;
  overflow: hidden;
  display: flex;

  .msg-box {
    max-width: 50%;
    word-wrap: break-word;
    padding: 5px 10px;
    position: relative;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    user-select: text;
    white-space: pre-wrap;
    overflow-wrap: anywhere;

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

      &::selection {
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

      &::selection {
        background-color: var(--bg);
        color: var(--text);
      }
    }
  }
}
</style>
