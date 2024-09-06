<template>
  <nav
    class="nav-container"
    :style="{
      left: navShow ? '0%' : '-110%'
    }"
  >
    <Icon class="close" name="return" @click="navShow = false"></Icon>
    <div class="profile">
      <Avatar :size="75" shape="circle" :src="user.avatar" />
      <span class="title">{{ user.username }}</span>
      <Status :value="user.status" />
    </div>
    <div class="options">
      <div
        v-for="item in navList"
        :key="item.name"
        class="option"
        :class="{ active: item.name === nav }"
        @click="handleClickOption(item.name)"
      >
        <Icon class="icon" :name="item.icon" />
        <span class="text">{{ item.text }}</span>
      </div>
    </div>
    <div class="version">FChat v1.0.0 ©Moipha</div>
  </nav>
</template>

<script lang="ts" setup>
import Icon from '@r/components/form/Icon.vue'
import Avatar from '@r/components/form/Avatar.vue'
import Status from '@r/components/form/Status.vue'
import bus from '@r/utils/bus'
import { ref, onBeforeUnmount } from 'vue'
import { useUserStore } from '@r/stores/user'
import { useSettingStore } from '@r/stores/setting'
import { storeToRefs } from 'pinia'
import router from '@r/router'

/**
 * 获取配置项
 */
const { nav, routeMap } = storeToRefs(useSettingStore())

// 获取用户信息
const { user } = useUserStore()

// 显示状态
const navShow = ref(false)

// 列表项
const navList = [
  {
    name: 'chat',
    icon: 'nav-chats',
    text: '聊天'
  },
  {
    name: 'group',
    icon: 'nav-groups',
    text: '群组'
  },
  {
    name: 'friend',
    icon: 'nav-friends',
    text: '好友'
  },
  {
    name: 'profile',
    icon: 'nav-profile',
    text: '个人'
  },
  {
    name: 'setting',
    icon: 'nav-settings',
    text: '设置'
  }
]

// 修改状态
bus.on('nav-toggle', (b) => {
  navShow.value = b
})
onBeforeUnmount(() => {
  bus.off('nav-toggle')
})

// 点击选项
function handleClickOption(name) {
  if (name === 'setting') {
    // 打开设置栏
  } else if (name === 'profile') {
    // 打开个人资料
  } else {
    routeMap.value[nav.value] = router.currentRoute.value.fullPath
    nav.value = name
  }
  // 关闭导航栏
  navShow.value = false
  // 跳转路由
  if (routeMap.value[name] !== undefined) {
    router.push(routeMap.value[name])
  } else {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.nav-container {
  width: 100%;
  height: 100vh;
  background-color: var(--bg);
  position: absolute;
  z-index: 1;
  transition: left 0.5s ease;
  left: -110%;
  box-shadow:
    5px 0px 20px var(--border),
    inset 5px 0px 10px var(--border);
  filter: brightness(0.95);
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .close {
    position: absolute;
    right: 0px;
    top: 15px;
    color: var(--light-text);
    font-size: 35px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
    margin-right: 10px;
    -webkit-app-region: no-drag;

    &:hover {
      transform: scale(1.1);
      color: var(--primary);
    }
  }

  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bolder;
      margin: 10px 0 5px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 90%;
      text-align: center;
    }
  }

  .options {
    width: 100%;
    -webkit-app-region: no-drag;

    .option {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      font-size: 20px;
      cursor: pointer;
      color: var(--text);
      font-family: dyh;
      font-weight: normal;

      .text {
        width: 40px;
        margin-left: 12px;
      }

      &:hover {
        background-color: var(--border);
      }
    }
    .active {
      background-color: var(--primary) !important;
      color: var(--btn-text) !important;
    }
  }

  .version {
    position: absolute;
    bottom: 5px;
    left: 10px;
    font-weight: bolder;
    font-family: Consolas;
    color: var(--light-text);
  }
}
</style>
