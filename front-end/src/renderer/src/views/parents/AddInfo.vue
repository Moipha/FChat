<template>
  <div class="container">
    <div>{{ id }}</div>
    <div>{{ username }}</div>
  </div>
</template>

<script lang="ts" setup>
// 接收路由中的参数
defineProps({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.container {
  background-color: var(--bg);
  height: 100vh;
  width: 100vw;
  -webkit-app-region: drag;
}
</style>
