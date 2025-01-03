<script lang="ts" setup>
import Status from '@r/components/form/Status.vue'
import bus from '@r/utils/bus'
import { getRecent } from '@r/utils/timeFormat'
import { toRef } from 'vue'

// 接收用户对象
const props = defineProps({
  friend: {
    type: Object,
    default: () => {}
  },
  lastSeen: {
    type: String,
    default: ''
  },
  bot: {
    type: Boolean,
    default: false
  },
  botTitle: {
    type: String,
    default: ''
  }
})

// 转为ref
const lastSeen = toRef(props, 'lastSeen')
// TODO 解决停滞在该页面中，上次查看时间不变动的问题

// 弹出右边栏
function showFriendDetail() {
  bus.emit('friend-detail-toggle', true)
}
</script>

<template>
  <header>
    <div v-if="bot" class="bot-title">{{ botTitle }}</div>
    <div v-else class="title">{{ friend.username }}</div>
    <div v-if="!bot" class="status-container">
      <Status :value="friend.status" />
      <div class="last-check">
        <span>上次查看于</span>
        <span class="time">{{ getRecent(lastSeen) }}</span>
      </div>
    </div>
    <div v-if="!bot" class="else-btn" @click.stop="showFriendDetail">
      <Icon class="icon" name="else" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 60px;
  background-color: var(--bg);
  -webkit-app-region: drag;
  transition: 0.2s all;
  border-bottom: 1px solid var(--border);

  .status-container {
    display: flex;
    gap: 20px;
    margin-top: 3px;
    margin-left: 20px;

    .last-check {
      font-size: 12px;
      color: var(--light-text);
      font-family: consolas;

      .time {
        font-weight: bold;
        margin-left: 2px;
      }
    }
  }

  .bot-title {
    width: calc(100% - 160px);
    font-size: 18px;
    font-weight: bolder;
    color: var(--text);
    padding-left: 20px;
    transition: 0.2s all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 60px;
  }
  .title {
    width: calc(100% - 160px);
    font-size: 16px;
    font-weight: bolder;
    color: var(--text);
    padding-left: 20px;
    transition: 0.2s all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 12px;
  }

  .else-btn {
    position: absolute;
    right: 10px;
    top: 30px;
    color: var(--light-text);
    font-size: 25px;
    -webkit-app-region: no-drag;
    cursor: pointer;

    .icon {
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.2);
        color: var(--primary);
      }
    }
  }
}
</style>
