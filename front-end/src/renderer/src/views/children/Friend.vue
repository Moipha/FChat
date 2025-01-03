<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
import { ref } from 'vue'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import bus from '@r/utils/bus'

// 获取好友列表
const { friends } = storeToRefs(useUserStore())

// 接收id
const props = defineProps(['id'])

// 接收好友信息
const friend = ref({})
friend.value = friends.value.find((item) => item._id === props.id)

// 跳转到聊天页面
function chat() {
  bus.emit('nav-jump', ['chat', '/chat/' + props.id])
}
</script>

<template>
  <div class="friend-container">
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
      <!-- 开关 -->
      <!-- <div class="toggle option">
        <span class="value">消息免打扰</span>
        <Switch v-model="config.silence" class="switch" />
      </div>
      <div class="toggle option">
        <span class="value">置顶该聊天</span>
        <Switch v-model="config.top" class="switch" />
      </div> -->
    </div>

    <div class="actions">
      <div class="item" @click="chat">
        <Icon class="icon" name="nav-chats" />
        <span class="text">发消息</span>
      </div>
      <div class="item">
        <Icon class="icon" name="nav-chats" />
        <span class="text">语音电话</span>
      </div>
      <div class="item">
        <Icon class="icon" name="nav-chats" />
        <span class="text">视频电话</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.friend-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--text);

  .profile {
    padding: 30px 20px 10px;
    display: flex;
    -webkit-app-region: drag;
    height: 120px;
    box-sizing: border-box;
    -webkit-app-region: drag;

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
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 300px;
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

  .actions {
    margin: 20px 30px;
    display: flex;
    justify-content: space-around;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 120px;
      padding: 20px 0;
      color: var(--light-text);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 4px;

      .icon {
        font-size: 30px;
      }

      .text {
        font-size: 16px;
        font-weight: bold;
      }

      &:hover {
        background-color: var(--border);
        color: var(--primary);
      }
    }
  }

  .rest {
    width: 100%;

    .key {
      color: var(--light-text);
      width: 25%;
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
