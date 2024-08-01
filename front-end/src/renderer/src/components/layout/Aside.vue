<template>
  <aside ref="aside">
    <div ref="drag" class="resize-handle" @mousedown="startDrag"></div>
    <header>
      <Icon name="menu" class="icon" @click="openMenu"></Icon>
      <SearchInput @keydown.enter="changeTheme" />
    </header>
    <nav ref="navBar" class="scroll-bar" @scroll="handleScroll" @click="selectChat">
      <div
        v-for="item in list"
        :key="item.id"
        :class="{ active: item.id === activeItem }"
        :data="item.id"
        class="chat-list"
      >
        <Avatar :src="item.avatar" shape="circle" />
        <div class="msg-box">
          <div class="name">{{ item.name }}</div>
          <div class="msg">{{ item.msg }}</div>
        </div>
        <div class="time-box">{{ timeFormat(item.createdTime) }}</div>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import SearchInput from '@r/components/form/SearchInput.vue'
import Icon from '@r/components/form/Icon.vue'
import Avatar from '@r/components/form/Avatar.vue'
import timeFormat from '@r/utils/timeFormat'
import router from '@r/router'
import request from '@r/utils/request'
import { useRoute } from 'vue-router'

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
  const res = await request.get('/user/aside')
  list.value = res.data
}
getList()

/**
 * 滚动条事件
 */
const navBar = ref(null)

const handleScroll = () => {
  if (navBar.value) {
    // 检查滚动条是否在顶端
    if (navBar.value.scrollTop > 0) {
      // 如果不在顶端，添加add-border类
      navBar.value.classList.add('add-border')
    } else {
      // 如果在顶端，移除add-border类
      navBar.value.classList.remove('add-border')
    }
  }
}

onMounted(() => {
  // 挂载完成后添加滚动事件监听
  if (navBar.value) {
    navBar.value.addEventListener('scroll', handleScroll)
  }
})

/**
 * 打开对应聊天界面
 */
function selectChat(e) {
  let cur = e.target
  // 通过代理事件减少绑定事件的数量
  while (cur && cur.offsetParent) {
    if (cur.className === 'chat-list') {
      break
    }
    cur = cur.offsetParent
  }
  const key = cur.attributes.data
  if (key) {
    // 设置生效的item
    activeItem.value = key.value
    // 跳转到对应路由
    router.push('/chat/' + key.value)
  }
}
// 记录生效的item
const activeItem = ref(null)
// 初始加载时从路由获取当前item
const route = useRoute()
activeItem.value = route.params.id

/**
 * 打开菜单
 */
function openMenu() {
  router.push('/')
  activeItem.value = null
}

/**
 * temp 修改主题
 */
function changeTheme() {
  document.body.classList.toggle('dark-theme')
  // // 修改标题栏的样式
  // const body = getComputedStyle(document.body)
  // window.api.changeTitleBar([body.getPropertyValue('--text')])
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

  nav {
    height: calc(100vh - 60px);
    transition: border 0.2s;
    border-top: 1px solid transparent;
    .chat-list {
      height: 64px;
      width: calc(100% - 20px);
      padding: 0 10px 0 10px;
      background-color: var(--bg);
      display: flex;
      position: relative;
      transition:
        0.2s all,
        0s width;
      cursor: pointer;
      img {
        align-self: center;
      }
      &:hover {
        background-color: var(--border);
      }
      .msg-box {
        display: flex;
        flex-direction: column;
        padding: 10px;
        justify-content: space-between;
        width: calc(100% - 64px);
        white-space: nowrap;
        .name {
          font-size: 15px;
          color: var(--text);
          font-weight: bold;
          text-overflow: ellipsis;
          overflow: hidden;
          width: calc(100% - 64px);
          transition: color 0.2s;
        }
        .msg {
          font-size: 13px;
          color: var(--light-text);
          text-overflow: ellipsis;
          overflow: hidden;
          width: calc(100% - 30px);
          transition: color 0.2s;
        }
      }
      .time-box {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
        color: var(--light-text);
        font-family: 'consolas';
        transition: color 0.2s;
      }
    }
    .active {
      background-color: var(--primary);
      --text: var(--btn-text);
      --light-text: var(--btn-text);
      &:hover {
        background-color: var(--primary);
        color: var(--btn-text);
      }
    }
  }

  .resize-handle {
    width: 7px;
    height: 100%;
    position: absolute;
    right: -3px;
    top: 0;
    cursor: ew-resize;
  }
}
</style>
