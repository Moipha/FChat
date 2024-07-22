<template>
  <aside ref="aside">
    <div ref="drag" class="resize-handle" @mousedown="startDrag"></div>
    <header>
      <Icon name="menu" class="icon"></Icon>
      <SearchInput></SearchInput>
    </header>
    <nav>
      <div v-for="item in list" :key="item.name" class="chat-list">
        {{ item.name }}
        {{ item.lastMsg }}
        {{ item.time }}
        {{ item.avatar }}
      </div>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SearchInput from './SearchInput.vue'
import Icon from './Icon.vue'
import request from '@r/utils/request'

/**
 * 拖拽动态修改aside的宽度
 */
// ref节点
const aside = ref()
const drag = ref()
// 拖拽事件计算值
let dragStartX = 0
let startWidth = 0
// 拖拽事件
function startDrag(e) {
  // 阻止默认事件
  e.preventDefault()
  // 获取鼠标点击时的x坐标
  dragStartX = e.clientX
  startWidth = parseInt(getComputedStyle(aside.value).width, 10)
  // 在document上添加事件监听
  document.addEventListener('mousemove', dragMove)
  document.addEventListener('mouseup', endDrag)
  // 防止在拖动时选中页面上的文本
  document.body.style.userSelect = 'none'
}
function dragMove(e) {
  const newWidth = startWidth + e.clientX - dragStartX
  aside.value.style.width = `${newWidth}px`
}
function endDrag() {
  document.removeEventListener('mousemove', dragMove)
  document.removeEventListener('mouseup', endDrag)
  document.body.style.userSelect = ''
}

/**
 * 列表数据获取
 */
const list = ref([])
async function getList() {
  const res = await request.get('/get-list')
  list.value = res.data.data
}
getList()
</script>

<style lang="scss" scoped>
aside {
  width: 400px;
  min-width: 200px;
  max-width: calc(100vw - 400px);
  height: 100vh;
  transition:
    all 0.2s,
    0s width;
  border-right: 1px solid var(--border);
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  position: relative;

  header {
    -webkit-app-region: drag;
    height: 60px;
    border-bottom: solid 1px var(--border);
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      color: var(--text);
      font-size: 40px;
      cursor: pointer;
      -webkit-app-region: no-drag;
      margin: 0 10px;
      flex-shrink: 0;
    }
  }

  nav {
    height: calc(100vh - 60px);
    overflow-y: scroll;

    .chat-list {
      height: 64px;
      background-color: var(--primary);
    }
  }

  .resize-handle {
    width: 5px;
    height: 100%;
    position: absolute;
    right: -2px;
    top: 0;
    cursor: ew-resize;
  }
}
</style>
