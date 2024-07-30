<template>
  <section class="container">
    <Aside />
    <main>
      <router-view :key="$route.params.id" />
    </main>
  </section>
  <Titlebar />
</template>

<script setup>
import Aside from '@r/components/layout/Aside.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
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
