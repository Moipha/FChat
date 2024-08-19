<template>
  <div ref="container" class="container">
    <!-- 头像和基本信息 -->
    <div class="profile">
      <Avatar class="avatar" :src="friend.avatar" shape="circle" :size="75" />
      <div class="detail">
        <span class="title">{{ friend.username }}</span>
        <span class="subtitle dyh">
          <Icon class="email" name="email" />
          {{ friend.email }}
        </span>
        <span class="subtitle">于{{ new Date(friend.createdTime).toLocaleDateString() }}注册</span>
      </div>
    </div>
    <hr />
    <div class="rest scroll-bar">
      <!-- 当前状态 -->
      <div class="option">
        <span class="key">登录状态</span>
        <span class="value">{{ friend.status }}</span>
      </div>
      <!-- 备注 -->
      <div class="option">
        <span class="key">备注</span>
        <span class="value">remark</span>
        <Icon class="icon" name="edit" />
      </div>
      <!-- 签名 -->
      <div class="option">
        <span class="key">个性签名</span>
        <span class="value">sign</span>
      </div>
      <hr />
      <!-- 聊天记录 -->
      <div class="history option">
        <span class="value">聊天记录</span>
        <Icon class="icon" name="right" />
      </div>
      <hr />
      <!-- 开关 -->
      <div class="toggle option">
        <span class="value">消息免打扰</span>
        <Switch v-model="config.silence" class="switch" />
      </div>
      <div class="toggle option">
        <span class="value">置顶该聊天</span>
        <Switch v-model="config.top" class="switch" />
      </div>
      <hr />
      <!-- 操作 -->
      <div class="action option">清空聊天记录</div>
      <div class="action option">解除好友关系</div>
      <div class="block"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onActivated, onUnmounted, ref } from 'vue'
import Avatar from '@r/components/form/Avatar.vue'
import Icon from '@r/components/form/Icon.vue'
import Switch from '@r/components/form/Switch.vue'

import bus from '@r/utils/bus'

// 整体的ref
const container = ref(null)

// props
defineProps({
  friend: {
    type: Object,
    default: () => ({})
  }
})

function show() {
  // 显示界面
  bus.on('show-friend-detail', () => {
    container.value.style.right = '0'
    // 添加全局点击事件：点击其它地方隐藏右边栏
    window.addEventListener('click', hide)
  })
}
onUnmounted(() => {
  bus.off('show-friend-detail')
  window.removeEventListener('click', hide)
})
onActivated(() => {
  show()
})

// 隐藏界面
function hide(event) {
  // 如果点击的是container或其子元素，则不执行任何操作
  if (!container.value || container.value.contains(event.target)) {
    return
  }
  // 否则隐藏界面
  container.value.style.right = '-110%'
  // 并卸载事件
  window.removeEventListener('click', hide)
}

// 好友配置
const config = ref({})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: -110%;
  z-index: 1;
  transition:
    all 0.2s,
    right 0.6s ease;
  background-color: var(--bg);
  box-shadow:
    5px 0px 20px var(--border),
    inset -5px 0px 10px var(--border);
  filter: brightness(0.9);
  display: flex;
  flex-direction: column;
  -webkit-app-region: no-drag;

  .profile {
    padding: 30px 20px 10px;
    display: flex;
    -webkit-app-region: drag;
    height: 120px;
    box-sizing: border-box;

    .avatar {
      margin: 0 10px;
    }

    .detail {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .title {
        font-weight: bolder;
        font-size: 18px;
        color: var(--text);
        transition: color 0.2s;
      }

      .subtitle {
        color: var(--light-text);
        font-size: 14px;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        letter-spacing: 0.5px;

        .email {
          margin-right: 5px;
          font-size: 16px;
        }
      }
    }
  }

  .rest {
    height: calc(100vh - 128px);

    .key {
      color: var(--light-text);
      width: 30%;
      transition: color 0.2s;
    }

    .value {
      color: var(--text);
      transition: color 0.2s;
    }

    .icon {
      margin-left: auto;
      font-size: 25px;
      color: var(--light-text);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }

    .option {
      height: 60px;
      padding: 0 40px;
      font-size: 16px;
      font-weight: bolder;
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .switch {
        margin-left: auto;
      }
    }

    .history {
      cursor: pointer;
    }

    .action {
      height: 40px;
      margin: 20px 40px 0;
      border-radius: 5px;
      cursor: pointer;
      background-color: var(--error);
      color: var(--btn-text);
      font-weight: bolder;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        filter: brightness(1.3) saturate(0.8);
      }
    }
    .block {
      height: 20px;
    }
  }

  hr {
    margin: 0 30px;
    border: none;
    height: 5px;
    background-color: var(--border);
    border-radius: 1px;
    transform: scale(1, 0.2);
    transition: background-color 0.2s;
  }
}
</style>
