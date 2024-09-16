<template>
  <div class="main">
    <div class="block" :class="{ hide: !hide }">
      <div class="title dyh">查找新朋友</div>
      <Search
        v-model="keyword"
        v-model:hide="hide"
        placeholder="请输入邮箱或用户名以进行搜索"
        @input="searchDebounce"
      />
    </div>
    <div class="list scroll-bar" :style="{ marginTop: hide ? '0' : '-40px' }">
      <div v-for="user in list" :key="user._id">
        <div class="item">
          <Avatar :src="user.avatar" shape="circle" :size="50" />
          <div class="info">
            <span class="title">{{ user.username }}</span>
            <span class="subtitle dyh">{{ user.email }}</span>
          </div>
          <span v-if="ids.includes(user._id)" class="text">已添加</span>
          <span v-else-if="curUser._id == user._id" class="text">我</span>
          <span
            v-else-if="
              applyList.findIndex(
                (item) => item.friendId === user._id && item.status === 'requested'
              ) !== -1
            "
            class="text"
            >已申请</span
          >
          <div v-else class="icon-container" @click="openAddInfo(user)">
            <Icon class="icon" name="add-friend" />
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
  <Titlebar :minimize="false" :maximize="false" :height="15" />
</template>

<script lang="ts" setup>
import Search from '@r/components/form/Search.vue'
import Avatar from '@r/components/form/Avatar.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
import { ref } from 'vue'
import request from '@r/utils/request'
import debounce from '@r/utils/debounce'
import { useUserStore } from '@r/stores/user'
import { useSignStore } from '@r/stores/sign'

import { storeToRefs } from 'pinia'

// 获取当前用户好友列表
const { user: curUser, friends, applyList } = storeToRefs(useUserStore())
const ids = friends.value.map((item) => item._id)

// 获取新添加用户信息
const { addUser } = storeToRefs(useSignStore())

// 搜索关键词
const keyword = ref('')
// 隐藏搜索框
const hide = ref(true)

// 发请求进行搜索
async function search() {
  const kw = keyword.value
  // 搜索词为空时不请求
  if (kw !== '') {
    const res = await request.get('/user/search', { params: { keyword: keyword.value } })
    if (res && res.code === 200) {
      list.value = res.data
    }
  } else {
    list.value = []
  }
}
// 应用防抖函数
const searchDebounce = debounce(search, 500)

// 用户列表
const list = ref([])

// 打开添加好友窗口
function openAddInfo(user) {
  addUser.value = user
  window.api.openDialog({
    height: 400,
    width: 450,
    route: `/add-info`,
    modal: true
  })
}
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  width: 100vw;
  background-color: var(--bg);
  color: var(--text);
  -webkit-app-region: drag;

  .block {
    height: 100%;
    transition: 0.5s all ease;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 2;

    .title {
      font-size: 25px;
      text-align: center;
    }
  }

  .list {
    position: relative;
    z-index: 2;
    height: 64%;
    -webkit-app-region: no-drag;
    padding-top: 40px;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;

      .info {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        width: 60%;

        .title {
          font-size: 16px;
          font-weight: bold;
          color: var(--text);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .subtitle {
          font-size: 14px;
          color: var(--light-text);
        }
      }

      .icon-container {
        width: 42px;
        display: flex;
        justify-content: center;

        .icon {
          font-size: 25px;
          color: var(--light-text);
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            color: var(--primary);
            transform: scale(1.1);
          }
        }
      }

      .text {
        text-align: center;
        font-size: 14px;
        width: 42px;
        font-weight: bold;
        color: var(--light-text);
      }
    }

    hr {
      margin: 10px 50px;
      border: 1px solid var(--border);
    }
  }

  .hide {
    height: 36%;
  }
}
</style>
