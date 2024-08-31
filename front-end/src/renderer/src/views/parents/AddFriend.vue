<template>
  <div class="main">
    <div class="title dyh">查找新朋友</div>
    <div class="input-container">
      <Search v-model="keyword" placeholder="请输入邮箱或用户名" />
    </div>
    <nav class="list">
      <div class="item"></div>
    </nav>
  </div>
  <nav>
    <Icon class="icon exit" name="close" @click="close" />
  </nav>
</template>

<script lang="ts" setup>
import Search from '@r/components/form/Search.vue'
import Icon from '@r/components/form/Icon.vue'
import { ref } from 'vue'

const keyword = ref('')

// 关闭窗口
function close() {
  window.api.closeWindow()
}
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  width: 100vw;
  background-color: var(--bg);
  color: var(--text);
  -webkit-app-region: drag;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;

  .title {
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    margin-top: -40px;
  }

  .input-container {
  }

  .list {
    .item {
    }
  }
}

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
    color: white;
  }
}
</style>
