<template>
  <section class="container">
    <Aside></Aside>
    <main>
      <router-view />
      <!-- <button @click="changeTheme">123</button> -->
    </main>
  </section>
</template>

<script setup>
import Aside from '@r/components/layout/Aside.vue'
// function changeTheme() {
//   document.body.classList.toggle('dark-theme')
//   // 修改标题栏的样式
//   const body = getComputedStyle(document.body)
//   window.api.changeTitleBar([body.getPropertyValue('--text')])
// }
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100vw;
  main {
    display: flex;
    flex: 1;
    min-width: 400px;
    overflow: hidden;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bg);
    transition: 0.2s all;
  }
}
</style>
