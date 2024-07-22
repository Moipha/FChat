<template>
  <section class="container">
    <Aside></Aside>
    <section class="right-container">
      <Header></Header>
      <main>
        <router-view />
        <button @click="changeTheme">123</button>
      </main>
    </section>
  </section>
</template>

<script setup>
import Header from './Header.vue'
import Aside from './Aside.vue'
function changeTheme() {
  document.body.classList.toggle('dark-theme')
  // 修改标题栏的样式
  const body = getComputedStyle(document.body)
  window.api.changeTitleBar([body.getPropertyValue('--text')])
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  .right-container {
    display: flex;
    flex-direction: column;
    min-width: 400px;
    height: 100vh;
    background-color: var(--bg);
    transition: 0.2s all;
  }
}
</style>
