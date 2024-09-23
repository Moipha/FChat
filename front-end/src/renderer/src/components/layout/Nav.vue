<template>
  <nav
    class="nav-container"
    :style="{
      left: navShow ? '0' : '-300px'
    }"
  >
    <div class="profile">
      <Avatar class="avatar" :size="60" shape="circle" :src="user.avatar" @click="openProfile" />
      <div class="detail" @click="openProfile">
        <span class="title">{{ user.username }}</span>
        <span class="subtitle dyh">
          <Icon class="email" name="email" />
          {{ user.email }}
        </span>
        <Status class="status" :value="user.status" @click.stop />
      </div>
    </div>
    <hr />
    <div class="options">
      <div
        v-for="item in navList"
        :key="item.name"
        class="option"
        :class="{ active: item.name === nav }"
        @click="handleClickOption(item.name)"
      >
        <Icon :name="item.icon" />
        <span class="text">{{ item.text }}</span>
      </div>
    </div>
    <div class="option theme" @click="changeTheme()">
      <Icon name="theme-switch" />
      <span class="text">夜间模式</span>
      <Switch v-model="isDark" :size="10" class="switch" />
    </div>
    <div class="option theme danger" @click="exit">
      <Icon name="nav-logout" />
      <span class="text">退出登录</span>
    </div>
    <div class="version">
      <span @click="openExternal('https://github.com/Moipha/FChat')">FChat</span>
      <span @click="openExternal('https://github.com/Moipha/FChat')">v1.0.0</span>
      <span @click="openExternal('https://github.com/Moipha')">©Moipha</span>
    </div>
  </nav>
  <Mask v-model="navShow" to="body" />
</template>

<script lang="ts" setup>
import Avatar from '@r/components/form/Avatar.vue'
import Status from '@r/components/form/Status.vue'
import Switch from '@r/components/form/Switch.vue'
import Mask from '@r/components/layout/Mask.vue'
import bus from '@r/utils/bus'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useUserStore } from '@r/stores/user'
import { useSettingStore } from '@r/stores/setting'
import { storeToRefs } from 'pinia'
import router from '@r/router'

/**
 * 获取配置项
 */
const { nav, routeMap, theme } = storeToRefs(useSettingStore())

// 布尔类型主题
const isDark = ref(theme.value === 'dark-theme')

// 监听lightTheme的变化，并同步更新theme
watch(isDark, (newVal) => {
  const newTheme = newVal ? 'dark-theme' : 'light-theme'
  changeTheme(newTheme)
})

// 监听theme的变化，并同步更新lightTheme
watch(theme, (newVal) => {
  isDark.value = newVal === 'dark-theme'
})

// 获取用户信息
const { user } = storeToRefs(useUserStore())

// 显示状态
const navShow = ref(false)

// 列表项
const navList = [
  {
    name: 'chat',
    icon: 'nav-chats',
    text: '聊天'
  },
  // {
  //   name: 'group',
  //   icon: 'nav-groups',
  //   text: '群组'
  // },
  {
    name: 'friend',
    icon: 'nav-friends',
    text: '通讯录'
  },
  {
    name: 'profile',
    icon: 'nav-profile',
    text: '个人中心'
  }
  // {
  //   name: 'setting',
  //   icon: 'nav-settings',
  //   text: '设置'
  // }
]

// 点击选项
function handleClickOption(name) {
  // 跳转路由
  if (routeMap.value[name] !== undefined) {
    jump(name, routeMap.value[name])
  } else {
    jump(name, '/')
  }
}

function jump(name, route) {
  if (name === 'setting') {
    // 打开设置栏
  } else if (name === 'profile') {
    // 打开个人资料
    return openProfile()
  } else {
    routeMap.value[nav.value] = router.currentRoute.value.fullPath
    nav.value = name
  }
  // 关闭导航栏
  navShow.value = false
  // 跳转路由
  router.push(route)
}

// 退出登录
function exit() {
  // 清除登录信息
  localStorage.removeItem('user')
  useSettingStore().logout()
  window.api.logout()
}

// 修改状态
bus.on('nav-toggle', (b) => {
  navShow.value = b
})
onBeforeUnmount(() => {})

bus.on('nav-jump', ([name, route]) => {
  jump(name, route)
  routeMap.value[name] = route
})

onBeforeUnmount(() => {
  bus.off('nav-toggle')
  bus.off('nav-jump')
})

/**
 * 修改主题
 */
function changeTheme(tm) {
  // 添加过渡
  document.body.classList.add('transition')
  // 切换主题
  const cur = tm || (theme.value === 'light-theme' ? 'dark-theme' : 'light-theme')
  document.body.classList.remove('light-theme', 'dark-theme')
  document.body.classList.add(cur)
  theme.value = cur
  // 删除过渡
  setTimeout(() => {
    document.body.classList.remove('transition')
  }, 200)
}

// 打开外部链接
function openExternal(url) {
  window.api.openExternal(url)
}

// 打开个人中心
function openProfile() {
  window.api.openDialog({
    width: 600,
    height: 450,
    title: user.username,
    route: '/profile',
    frame: true
  })
}
</script>

<style lang="scss" scoped>
.nav-container {
  width: 300px;
  height: 100vh;
  background-color: var(--bg);
  position: absolute;
  z-index: 10;
  transition:
    left 0.3s ease,
    background-color 0.2s ease;
  left: -300px;
  display: flex;
  flex-direction: column;

  .profile {
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 30px;
    gap: 20px;

    .detail,
    .avatar {
      cursor: pointer;
    }

    .detail {
      display: flex;
      flex-direction: column;
      align-self: flex-start;

      .title {
        font-size: 14px;
        font-weight: bolder;
        color: var(--text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 90%;
        text-align: left;
        transition: color 0.2s ease;
      }

      .subtitle {
        color: var(--light-text);
        font-size: 12px;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        letter-spacing: 0.5px;

        .email {
          margin-top: 3px;
          margin-right: 3px;
          font-size: 12px;
        }
      }

      .status {
        position: absolute;
        right: 20px;
        top: 120px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
    }
  }

  hr {
    margin: 0;
    border-top: 0px;
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
  }

  .options {
    width: 100%;

    .active {
      background-color: var(--primary) !important;
      color: var(--btn-text) !important;
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }
  }

  .option {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 15px 15px 30px;
    font-size: 20px;
    cursor: pointer;
    color: var(--text);
    font-family: dyh;
    transition: color 0.2s ease;

    .text {
      margin-left: 25px;
      font-size: 18px;
      letter-spacing: 2px;
    }

    .switch {
      margin-left: auto;
    }

    &:hover {
      background-color: var(--hover);
    }
  }

  .theme {
    transition: all 0.2s ease;
  }

  .danger {
    color: var(--error);
  }

  .version {
    position: absolute;
    bottom: 15px;
    left: 30px;
    font-family: Consolas;

    span {
      margin-right: 10px;
      color: var(--light-text);
      cursor: pointer;

      &:hover {
        color: var(--text);
        text-decoration: underline;
      }
    }
  }
}
</style>
