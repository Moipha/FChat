<template>
  <div class="container">
    <div class="info">
      <Avatar :src="addUser.avatar" shape="circle" />
      <div class="text">
        <div class="title">{{ addUser.username }}</div>
        <div class="subtitle dyh">{{ addUser.email }}</div>
      </div>
    </div>
    <hr />
    <div class="content">
      <label for="content">申请信息</label>
      <textarea
        v-model="content"
        maxlength="100"
        spellcheck="false"
        rows="5"
        name="content"
        type="text"
      />
    </div>
    <div class="content">
      <label for="remark">备注</label>
      <input maxlength="20" spellcheck="false" rows="5" name="remark" type="text" />
    </div>
    <div class="btn-container">
      <Btn type="primary" label="发送申请" @click="addFriend" />
      <Btn label="取消" @click="cancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
import Btn from '@r/components/form/Btn.vue'
import { useSignStore } from '@r/stores/sign'
import { useUserStore } from '@r/stores/user'
import request from '@r/utils/request'
import { ref } from 'vue'

// 获取要添加的用户
const { addUser } = useSignStore()

// 获取当前用户
const { user } = useUserStore()

// 申请信息
const content = ref(`我是 ${user.username}`)

// 申请添加好友
async function addFriend() {
  const res = await request.post('/friendship', { friendId: addUser._id, content: content.value })
  if (res.code === 200) {
    alert(`已成功向 ${addUser.username} 发送好友申请，请等待对方通过申请`)
    window.api.closeWindow()
  }
}

// 关闭弹窗
function cancel() {
  window.api.closeWindow()
}
</script>

<style lang="scss" scoped>
.container {
  background-color: var(--bg);
  height: 100vh;
  width: calc(100% - 40px);
  -webkit-app-region: drag;
  padding: 0 20px;

  .info {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 12px;

    .text {
      .title {
        font-size: 16px;
        font-weight: bold;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 360px;
      }

      .subtitle {
        font-size: 14px;
        color: var(--light-text);
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    -webkit-app-region: no-drag;

    label {
      margin: 10px 0 5px;
      font-size: 18px;
      font-family: dyh;
      color: var(--light-text);
    }

    textarea,
    input {
      background-color: var(--bg);
      filter: brightness(0.95);
      text-decoration: none;
      outline: none;
      border: 2px solid var(--border);
      font-size: 16px;
      font-family: Consolas;
      resize: none;
      border-radius: 4px;
      padding: 5px 3px 0;
      color: var(--light-text);
    }

    input {
      padding: 5px;
    }
  }

  .btn-container {
    margin-top: 30px;
  }
}
</style>
