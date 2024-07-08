<template>
  <aside class="left"></aside>
  <div class="right">
    <header></header>
    <main>
      <router-view />
      <button @click="changeTheme">123</button>
    </main>
  </div>
</template>

<script setup>
function changeTheme() {
  document.body.classList.toggle('dark-theme')
  // 修改标题栏的样式
  const body = getComputedStyle(document.body)
  window.api.changeTitleBar([body.getPropertyValue('--btn-text')])
}
</script>

<style lang="scss" scoped>
.left {
  width: 100px;
  height: 100vh;
  background-color: var(--primary);
  -webkit-app-region: drag;
  transition: 0.2s all;
}

.right {
  flex: 1;
  height: 100vh;
  background-color: var(--bg);
  flex-direction: column;
  transition: 0.2s all;

  header {
    height: 60px;
    background-color: var(--primary);
    -webkit-app-region: drag;
    transition: 0.2s all;
  }
}
</style>
