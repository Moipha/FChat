<template>
  <nav>
    <header>申请列表</header>
    <div class="info dyh">新朋友</div>
    <div v-for="item in list" :key="item._id" class="item">
      <Avatar shape="circle" :size="50" :src="item.user.avatar" />
      <div class="text">
        <div class="title">{{ item.user.username }}</div>
        <div class="subtitle dyh">{{ item.content }}</div>
      </div>
      <div class="btn hover"><Icon class="icon" name="add-friend" />接受</div>
    </div>
    <div class="info dyh">我的申请</div>
    <div v-for="item in myReq" :key="item._id" class="item">
      <Avatar shape="circle" :size="50" :src="item.friend.avatar" />
      <div class="text">
        <div class="title">{{ item.friend.username }}</div>
        <div class="subtitle dyh">{{ item.content }}</div>
      </div>
      <div v-if="item.status === 'requested'" class="btn">已发送</div>
      <div v-else-if="item.status === 'rejected'" class="btn error">对方已拒绝</div>
      <div v-else class="btn success">对方已接受</div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import request from '@r/utils/request'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import Avatar from '@r/components/form/Avatar.vue'
import Icon from '@r/components/form/Icon.vue'

// 获取当前用户信息
const { user } = storeToRefs(useUserStore())

// 申请记录
const list = ref([])
const myReq = ref([])

// 获取列表
async function load() {
  const res = await request.get('/user/add-list')
  if (res.code === 200) {
    myReq.value = res.data.filter((item) => item.userId === user.value._id)
    list.value = res.data.filter((item) => item.userId !== user.value._id)
  }
}

// 发送请求
load()
</script>

<style lang="scss" scoped>
nav {
  -webkit-app-region: drag;
  height: 100vh;
  width: 100%;
  gap: 20px;
  display: flex;
  flex-direction: column;

  header {
    height: 60px;
    border-bottom: 1px solid var(--border);
    line-height: 60px;
    padding-left: 20px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.2s ease;
    color: var(--text);
  }

  .item {
    margin: 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    .text {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;

      .title {
        font-size: 14px;
        color: var(--text);
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .subtitle {
        font-size: 12px;
        color: var(--light-text);
        transition: all 0.2s ease;
      }
    }

    .btn {
      margin-left: auto;
      width: 70px;
      flex-shrink: 0;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3px;
      font-size: 14px;
      border-radius: 20px;
      background-color: var(--bg);
      color: var(--text);
      padding: 8px 5px;
      transition: all 0.2s ease;
      -webkit-app-region: no-drag;

      &.hover:hover {
        color: var(--primary);
        cursor: pointer;
      }

      .icon {
        font-size: 20px;
      }
    }

    .error {
      color: var(--error);
    }

    .success {
      color: var(--primary);
    }
  }

  .info {
    font-size: 20px;
    margin-left: 20px;
    margin-top: 10px;
    color: var(--light-text);
    transition: all 0.2s ease;
  }
}
</style>
