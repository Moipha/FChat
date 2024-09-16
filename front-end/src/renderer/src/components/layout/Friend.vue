<template>
  <div ref="container" class="container" :style="{ right: isShow ? '0' : '-400px' }">
    <!-- 头像和基本信息 -->
    <div class="profile">
      <Avatar class="avatar" :src="friend.avatar" shape="circle" :size="75" />
      <div class="detail">
        <span class="title">{{ friend.username }}</span>
        <span class="subtitle dyh">
          <Icon class="email" name="email" />
          {{ friend.email }}
        </span>
      </div>
    </div>
    <hr />
    <div class="rest scroll-bar">
      <!-- 当前状态 -->
      <div class="option" :class="friend.status === 'online' ? 'primary' : 'warning'">
        <Icon class="svg" :name="friend.status === 'online' ? 'online' : 'offline'" />
        <span class="value">{{ statusMap[friend.status] }}</span>
      </div>
      <!-- 备注 -->
      <div class="option">
        <Icon class="svg" name="mention" />
        <span class="value">remark</span>
        <Icon class="icon" name="edit" />
      </div>
      <hr />
      <!-- 开关 -->
      <div class="option action" @click="config.silence = !config.silence">
        <Icon class="svg" name="notify"></Icon>
        <span class="value">消息免打扰</span>
        <Switch v-model="config.silence" :size="10" class="switch" />
      </div>
      <div class="option action" @click="config.top = !config.top">
        <Icon class="svg" name="pinned" />
        <span class="value">置顶该聊天</span>
        <Switch v-model="config.top" :size="10" class="switch" />
      </div>
      <hr />
      <!-- 聊天记录 -->
      <div class="action option">
        <Icon name="nav-chats" class="svg" />
        <span class="value">聊天记录</span>
        <Icon name="right" class="icon" />
      </div>
      <div class="option action warning">
        <Icon name="delete" class="svg" />
        <span class="value">清空聊天记录</span>
      </div>
      <hr />
      <div class="action option">
        <Icon name="share" class="svg" />
        <span class="value">推荐该联系人</span>
      </div>
      <div class="option action warning" @click="config.block = !config.block">
        <Icon name="block" class="svg" />
        <span class="value">屏蔽该联系人</span>
        <Switch v-model="config.block" :size="10" class="switch" color="var(--error)" />
      </div>
      <div class="option action warning">
        <Icon name="remove" class="svg" />
        <span class="value">删除该联系人</span>
      </div>
    </div>
  </div>
  <Mask v-model="isShow" to="body" />
</template>

<script lang="ts" setup>
import { onActivated, onUnmounted, ref } from 'vue'
import Avatar from '@r/components/form/Avatar.vue'
import Switch from '@r/components/form/Switch.vue'
import Mask from '@r/components/layout/Mask.vue'
import bus from '@r/utils/bus'

// 好友配置
const config = ref({})

// 边栏显示
const isShow = ref(false)

// 映射
const statusMap = {
  online: '在线',
  offline: '离线',
  busy: '忙碌',
  away: '离开'
}

// props
defineProps({
  friend: {
    type: Object,
    default: () => ({})
  }
})

function show() {
  // 显示界面
  bus.on('friend-detail-toggle', (b) => {
    isShow.value = b
  })
}
onUnmounted(() => {
  bus.off('friend-detail-toggle')
})
onActivated(() => {
  show()
})
</script>

<style lang="scss" scoped>
.container {
  width: 400px;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 10;
  transition:
    all 0.2s,
    right 0.3s ease;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  border-radius: 10px 0 0 10px;

  .profile {
    padding: 20px 10px 10px;
    display: flex;
    height: 120px;
    align-items: center;
    box-sizing: border-box;

    .avatar {
      margin: 0 10px;
    }

    .detail {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .title {
        font-weight: bolder;
        font-size: 16px;
        color: var(--text);
        transition: color 0.2s;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
      }

      .subtitle {
        color: var(--light-text);
        font-size: 14px;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        letter-spacing: 0.5px;
        cursor: text;
        user-select: text;

        .email {
          margin-right: 8px;
          font-size: 16px;
          cursor: default;
        }

        &::selection {
          background-color: var(--primary);
          color: var(--btn-text);
        }
      }
    }
  }

  .rest {
    height: calc(100vh - 128px);

    .value {
      font-weight: normal;
      font-family: 'Microsoft YaHei';
      transition: color 0.2s;
      font-size: 15px;
    }

    .icon {
      margin-left: auto;
      margin-right: 20px;
      font-size: 25px;
      color: var(--light-text);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }

    .svg {
      font-size: 23px;
      margin-left: 30px;
      margin-right: 40px;
      margin-top: 2px;
    }

    .option {
      height: 60px;
      font-size: 16px;
      font-weight: bolder;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--text);

      .switch {
        margin-left: auto;
        margin-right: 20px;
      }
    }

    .action {
      cursor: pointer;

      &:hover {
        background-color: var(--hover);
      }
    }

    .hr {
      margin-left: 100px;
    }

    .warning {
      color: var(--error);
    }

    .primary {
      color: var(--primary);
    }
  }

  hr {
    margin: 0;
    border: none;
    height: 5px;
    background-color: var(--border);
    // 高度写成五倍，然后缩放为0.2倍，解决1px问题
    transform: scale(1, 0.2);
    transition: background-color 0.2s;
  }
}
</style>
