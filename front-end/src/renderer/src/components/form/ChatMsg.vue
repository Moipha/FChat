<template>
  <div v-if="position === 'left'" class="chat-msg left">
    <Avatar src="" class="avatar" shape="circle" :size="40" />
    <div class="msg-box">{{ msg }}</div>
  </div>
  <div v-else class="chat-msg right">
    <div class="msg-box">{{ msg }}</div>
    <Avatar src="" class="avatar" shape="circle" :size="40" />
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

    &::before {
      content: '';
      position: absolute;
      bottom: -5.5px;
      border-left: 6px transparent solid;
      border-right: 6px transparent solid;
      border-bottom: 6px transparent solid;
    }
  }

  .avatar {
    align-self: flex-end;
    margin: 0 10px;
  }

  &.left {
    justify-content: flex-start;

    .msg-box {
      border-radius: 5px 5px 5px 0;
      background-color: var(--border);
      color: var(--text);

      &::before {
        left: -6px;
        transform: rotate(-45deg);
        border-top: 6px var(--border) solid;
      }
    }
  }

  &.right {
    justify-content: flex-end;

    .msg-box {
      border-radius: 5px 5px 0 5px;
      background-color: var(--primary);
      color: var(--btn-text);

      &::before {
        right: -5.5px;
        transform: rotate(45deg);
        border-top: 6px var(--primary) solid;
      }
    }
  }
}
</style>
