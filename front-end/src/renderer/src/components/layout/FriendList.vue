<template>
  <nav>
    <div class="about-add">
      <span class="text dyh">共 {{ friends.length }} 位好友</span>
      <Icon class="icon" name="add-friend" @click="openAdd" />
      <Icon
        class="icon"
        name="log"
        :class="activeItem === 'list' ? 'active' : ''"
        @click="toAddList"
      />
    </div>
    <div class="list scroll-bar" @click="selectFriend">
      <div
        v-for="friend in friends"
        :key="friend._id"
        :data="friend._id"
        class="friend no-transition"
        :class="activeItem === friend._id ? 'active' : ''"
      >
        <Avatar :size="45" class="avatar" :src="friend.avatar" shape="circle" />
        <span class="text text-no-transition">{{ friend.username }}</span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
import request from '@r/utils/request'
import { onBeforeUnmount, ref } from 'vue'
import router from '@r/router'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import bus from '@r/utils/bus'

// 获取好友列表
const { friends, applyList } = storeToRefs(useUserStore())

// 记录生效的item
const activeItem = ref(null)
// 初始加载时从路由获取当前item
setTimeout(() => {
  if (router.currentRoute.value.path !== '/add-list') {
    activeItem.value = router.currentRoute.value.params.id
  } else {
    activeItem.value = 'list'
  }
}, 0)

// 打开对应的好友界面
function selectFriend(e) {
  let cur = e.target
  // 通过代理事件减少绑定事件的数量
  while (cur && cur.offsetParent) {
    if (cur.className.slice(0, 6) === 'friend') {
      break
    }
    cur = cur.parentElement
  }
  const key = cur.attributes.data
  if (key) {
    // 设置生效的item
    activeItem.value = key.value
    // 跳转到对应路由
    router.push('/friend/' + key.value)
  }
}

// 跳转到申请列表
function toAddList() {
  activeItem.value = 'list'
  router.push('/add-list')
}

// 打开添加好友界面
function openAdd() {
  window.api.openDialog({
    route: '/add-friend',
    width: 600,
    height: 500,
    title: '添加好友'
  })
}

// 获取好友列表
async function getFriends() {
  const res = await request.get('/user/friends')
  if (res.code === 200) {
    friends.value = res.data
  }
}

// 获取申请列表
async function load() {
  const res = await request.get('/user/add-list')
  if (res.code === 200) {
    applyList.value = res.data
  }
}

// 发送请求
load()
getFriends()

// bus事件
bus.on('update-friends', () => {
  load()
  getFriends()
})

onBeforeUnmount(() => {
  bus.off('update-friends')
})
</script>

<style lang="scss" scoped>
nav {
  height: calc(100vh - 60px);
  transition: border 0.2s;
  border-top: 1px solid transparent;
  -webkit-app-region: no-drag;

  .about-add {
    padding: 0 15px 10px;
    border-bottom: 1px solid var(--border);
    transition: border 0.2s;
    -webkit-app-region: drag;

    .icon {
      float: right;
      margin-left: 10px;
      font-size: 25px;
      color: var(--text);
      transition: all 0.2s ease;
      cursor: pointer;
      -webkit-app-region: no-drag;

      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }

    .text {
      line-height: 25px;
      font-size: 18px;
      color: var(--text);
      transition: all 0.2s ease;
    }

    .active {
      transform: scale(1.1);
      color: var(--primary);
    }
  }

  .list {
    display: flex;
    flex-direction: column;

    .friend {
      padding: 10px;
      display: flex;
      color: var(--text);
      cursor: pointer;

      .text {
        line-height: 45px;
        font-size: 16px;
        margin-left: 10px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:hover {
        background-color: var(--hover);
      }
    }
    .active {
      background-color: var(--primary) !important;
      color: var(--btn-text) !important;
    }
  }
}
</style>
