<template>
  <aside ref="aside">
    <div class="resize-handle" @mousedown="handlerMouseDown"></div>
    <header></header>
    <nav></nav>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 拖动：动态修改长度
const aside = ref(null)
</script>

<style lang="scss" scoped>
aside {
  width: 400px;
  min-width: 200px;
  height: 100vh;
  transition: 0.2s all;
  border-right: 1px solid var(--text);
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  position: relative;

  header {
    -webkit-app-region: drag;
    height: 60px;
    border-bottom: solid 1px var(--text);
  }

  .resize-handle {
    width: 3px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    cursor: ew-resize;
  }
}
</style>
