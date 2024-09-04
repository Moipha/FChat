<template>
  <nav>
    <Icon class="icon" name="minimize" @click="mini" />
    <Icon class="icon" :name="maxIcon" @click="maxi" />
    <Icon class="icon exit" name="close" @click="close" />
  </nav>
</template>

<script lang="ts" setup>
import Icon from '@r/components/form/Icon.vue'
import { ref } from 'vue'

// 最大化和复原按钮切换
const maxIcon = ref('maximize')

// 标题栏事件
function mini() {
  window.api.minimize()
}
function maxi() {
  window.api.maximize(maxIcon.value === 'maximize')
}
function close() {
  window.api.closeWindow()
}

// 监听最大化事件
window.api.changeMaximize((status) => {
  maxIcon.value = status ? 'restore' : 'maximize'
})
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  z-index: 999;
  -webkit-app-region: no-drag;
  .icon {
    font-size: 12px;
    font-weight: bolder;
    cursor: pointer;
    background-color: transparent;
    transition: 0.2s all;
    padding: 6.5px 12px;
    color: var(--text);

    &:hover {
      background-color: var(--border);
    }
  }
  .exit:hover {
    background-color: var(--error);
    color: var(--btn-text);
  }
}
</style>
