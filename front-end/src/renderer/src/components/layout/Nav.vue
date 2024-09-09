<template>
  <nav
    class="nav-container"
    :style="{
      left: navShow ? '0%' : '-100%'
    }"
  >
    <div class="profile">
      <Avatar :size="60" shape="circle" :src="user.avatar" />
      <div class="detail">
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
    <div class="option" @click="changeTheme()">
      <Icon name="theme-switch" />
      <span class="text">夜间模式</span>
      <Switch v-model="lightTheme" class="switch" />
    </div>
    <div class="version">FChat v1.0.0 ©Moipha</div>
  </nav>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="navShow" class="nav-mask" @click="navShow = false"></div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import Icon from '@r/components/form/Icon.vue'
import Avatar from '@r/components/form/Avatar.vue'
import Status from '@r/components/form/Status.vue'
import Switch from '@r/components/form/Switch.vue'
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
const lightTheme = ref(theme.value === 'light-theme')

// 监听lightTheme的变化，并同步更新theme
watch(lightTheme, (newVal) => {
  const newTheme = newVal ? 'light-theme' : 'dark-theme'
  changeTheme(newTheme)
})

// 监听theme的变化，并同步更新lightTheme
watch(theme, (newVal) => {
  lightTheme.value = newVal === 'light-theme'
})

// 获取用户信息
const { user } = useUserStore()

// 显示状态
const navShow = ref(true)

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
    text: '通讯录'
  },
  {
    name: 'profile',
    icon: 'nav-profile',
    text: '个人中心'
  },
  {
    name: 'setting',
    icon: 'nav-settings',
    text: '设置'
  }
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
  } else {
    routeMap.value[nav.value] = router.currentRoute.value.fullPath
    nav.value = name
  }
  // 关闭导航栏
  navShow.value = false
  // 跳转路由
  router.push(route)
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
  const cur = tm || (theme.value === 'light-theme' ? 'dark-theme' : 'light-theme')
  document.body.classList.remove('light-theme', 'dark-theme')
  document.body.classList.add(cur)
  theme.value = cur
}
</script>

<style lang="scss" scoped>
.nav-container {
  width: 300px;
  height: 100vh;
  background-color: var(--bg);
  position: absolute;
  z-index: 2;
  transition:
    left 0.3s ease,
    background-color 0.2s ease;
  left: -100%;
  // box-shadow:
  //   5px 0px 20px var(--border),
  //   inset 5px 0px 10px var(--border);
  display: flex;
  flex-direction: column;

  .profile {
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: 30px;
    gap: 20px;

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
    }
  }

  .option {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 30px;
    font-size: 20px;
    cursor: pointer;
    color: var(--text);
    font-family: dyh;
    font-weight: normal;
    transition: all 0.2s ease;

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

  .version {
    position: absolute;
    bottom: 5px;
    left: 10px;
    font-weight: bolder;
    font-family: Consolas;
    color: var(--light-text);
  }
}

.nav-mask {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 1;
  opacity: 0.4;
  -webkit-app-region: no-drag;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 0.4;
}
</style>
