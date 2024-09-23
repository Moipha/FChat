<template>
  <div class="profile-container">
    <div class="title">
      <Icon class="icon" name="nav-profile" />
      <span>个人资料</span>
    </div>
    <hr />
    <div class="settings">
      <section class="left">
        <Input
          v-model="curUser.username"
          class="input-container"
          :custom-style="inputStyle"
          label="昵称"
        />
        <Input
          disabled
          :value="curUser.email"
          class="input-container"
          :custom-style="inputStyle"
          label="绑定邮箱"
        />
        <Btn type="primary" class="btn" @click="updateProfile({ username: curUser.username })"
          >更新资料</Btn
        >
      </section>
      <section class="right">
        <span class="text">头像</span>
        <Avatar class="avatar" :src="curAvatar" shape="circle" :size="150" />
        <Checkbox v-model="useDefault" class="checkbox" label="使用默认头像" />
        <Select v-if="useDefault" v-model="curAvatar" class="select" :list="avatars"></Select>
        <Btn
          class="btn"
          type="primary"
          @click="updateProfile({ avatar: (useDefault ? 'default:/' : '') + curAvatar })"
        >
          更新头像</Btn
        >
      </section>
    </div>
  </div>
  <Titlebar :minimize="false" :maximize="false" />
</template>

<script lang="ts" setup>
import Titlebar from '@r/components/layout/Titlebar.vue'
import Avatar from '@r/components/form/Avatar.vue'
import Select from '@r/components/form/Select.vue'
import Btn from '@r/components/form/Btn.vue'
import Input from '@r/components/form/Input.vue'
import Checkbox from '@r/components/form/Checkbox.vue'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import request from '@r/utils/request'

const { user } = storeToRefs(useUserStore())
const curUser = ref(window._.cloneDeep(user.value))

// 输入框自定义样式
const inputStyle = {
  padding: '5px 10px',
  borderRadius: '4px'
}

// 更新资料
async function updateProfile(obj) {
  // 发送请求更新用户信息
  const res = await request.put('/user/update', obj)
  if (res.code === 200) {
    window.$notify('资料更新成功')
    // 通知父窗口更新用户信息
    const { data } = res
    window.api.updateUserInfo(data)
  } else {
    window.$notify('资料更新失败')
  }
}

// 头像模式
const useDefault = ref(user.value.avatar?.startsWith('images'))
const curAvatar = ref(user.value.avatar)
const avatars = [
  { key: '默认头像1', value: 'images/default01.jpg' },
  { key: '默认头像2', value: 'images/default02.jpg' },
  { key: '默认头像3', value: 'images/default03.jpg' }
]
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  height: 100vh;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  color: var(--text);

  .title {
    font-size: 23px;
    position: relative;
    font-weight: normal;
    justify-self: center;
    padding: 15px 0 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    -webkit-app-region: drag;

    .icon {
      font-size: 30px;
    }
  }

  hr {
    border-bottom: none;
    border-top: 1.5px solid var(--border);
    width: 100%;
  }

  .settings {
    display: flex;
    padding: 10px 20px;

    .left {
      flex: 1;
      margin-right: 20px;

      .input-container {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .btn {
        font-size: 12px;
        margin-top: 10px;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      margin: 0 20px;
      gap: 10px;

      .text {
        font-size: 18px;
        position: relative;
        margin-bottom: 10px;
        font-family: dyh;
        letter-spacing: 2px;

        &::after {
          position: absolute;
          content: '';
          width: 32px;
          height: 3px;
          background-color: var(--primary);
          left: 0;
          bottom: -3px;
          border-radius: 5px;
        }
      }

      .avatar {
        cursor: pointer;
        margin-bottom: 5px;
      }

      .checkbox {
        margin-left: -4px;
      }

      .btn {
        margin-top: 5px;
        font-size: 12px;
        width: 80px;
      }
    }
  }
}
</style>
