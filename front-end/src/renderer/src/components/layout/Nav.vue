<template>
  <nav
    class="nav-container"
    :style="{
      left: navShow ? '0%' : '-110%'
    }"
  >
    <Icon class="close" name="return" @click="navShow = false"></Icon>
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
import bus from '@r/utils/bus'
import { ref, onBeforeUnmount } from 'vue'

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
  transition: left 0.5s;
  left: -110%;
  box-shadow: 5px 0px 20px var(--border);
  filter: brightness(0.9);
  -webkit-app-region: no-drag;
  display: flex;

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
    &:hover {
      transform: scale(1.1);
      color: var(--primary);
    }
  }
  .options {
    margin: auto;
    width: 100%;

    .option {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      font-size: 25px;
      cursor: pointer;
      color: var(--text);

      .text {
        width: 100px;
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
