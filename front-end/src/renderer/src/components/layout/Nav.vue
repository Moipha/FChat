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
      <div class="option">
        <Icon class="icon" name="nav-chats" /><span class="text">Chats</span>
      </div>
      <div class="option">
        <Icon class="icon" name="nav-groups" /><span class="text">Groups</span>
      </div>
      <div class="option">
        <Icon class="icon" name="nav-friends" /><span class="text">Friends</span>
      </div>
      <div class="option">
        <Icon class="icon" name="nav-profile" /><span class="text">Profile</span>
      </div>
      <div class="option">
        <Icon class="icon" name="nav-settings" /><span class="text">Settings</span>
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

// 获取用户信息
const { user } = useUserStore()

// 显示状态
const navShow = ref(false)

// 修改状态
bus.on('nav-toggle', (b) => {
  navShow.value = b
})
onBeforeUnmount(() => {
  bus.off('nav-toggle')
})
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
  filter: brightness(0.9);
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

      .text {
        width: 80px;
        margin-left: 10px;
      }

      &:hover {
        background-color: var(--primary);
        color: var(--btn-text);
      }
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
