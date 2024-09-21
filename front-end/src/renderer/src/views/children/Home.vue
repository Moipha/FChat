<template>
  <div class="home dyh">
    <img :src="icon" alt="logo" />
    <span>FChat</span>
  </div>
</template>

<script lang="ts" setup>
import icon from '@/public/icons/icon.png'
</script>

<style lang="scss" scoped>
.home {
  -webkit-app-region: drag;
  background-color: var(--bg);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: var(--text);
  transition: all 0.2s;

  img {
    margin-right: 10px;
    margin-bottom: 15px;
    width: 60px;
  }
}
</style>
