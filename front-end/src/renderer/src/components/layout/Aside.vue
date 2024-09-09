<template>
  <aside ref="aside">
    <div ref="drag" class="resize-handle" @mousedown="startDrag"></div>
    <header>
      <Icon name="menu" class="icon" @click="openMenu"></Icon>
      <SearchInput />
    </header>
    <Nav />
    <ChatList v-if="nav === 'chat'" />
    <FriendList v-else-if="nav === 'friend'" />
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SearchInput from '@r/components/form/SearchInput.vue'
import Icon from '@r/components/form/Icon.vue'
import Nav from '@r/components/layout/Nav.vue'
import ChatList from '@r/components/layout/ChatList.vue'
import FriendList from '@r/components/layout/FriendList.vue'
import bus from '@r/utils/bus'
import { useSettingStore } from '@r/stores/setting'
import { storeToRefs } from 'pinia'

/**
 * 获取配置项
 */
const { nav } = storeToRefs(useSettingStore())

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
 * 打开菜单
 */
function openMenu() {
  // 弹出Nav
  bus.emit('nav-toggle', true)
}
</script>

<style lang="scss" scoped>
aside {
  width: 400px;
  min-width: 200px;
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
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      color: var(--light-text);
      font-size: 40px;
      cursor: pointer;
      -webkit-app-region: no-drag;
      margin: 0 10px;
      flex-shrink: 0;
      transition: all 0.2s ease;
      &:hover {
        transform: scale(1.1);
        color: var(--primary);
      }
    }
  }

  .add-border {
    border-top: 1px solid var(--border);
  }

  .resize-handle {
    width: 7px;
    height: 100%;
    position: absolute;
    right: -3px;
    top: 0;
    cursor: ew-resize;
    z-index: 2;
  }
}
</style>
