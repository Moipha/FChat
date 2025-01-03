<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import router from '@r/router'
import { useSettingStore } from '@r/stores/setting'
import { useSocketStore } from '@r/stores/socket'
import request from '@r/utils/request'
import bus from '@r/utils/bus'
import { storeToRefs } from 'pinia'
const { routeMap } = useSettingStore()
const { webSocket } = storeToRefs(useSocketStore())

/**
 * 聊天历史记录
 * @type {title: String, createdTime: Date}[]
 */
const history = ref([])

const groupedHistory = computed(() => {
  const groups = {
    今天: [],
    昨天: [],
    前七天: [],
    前三十天: []
  }

  const now = new Date()
  const today = now.toISOString().split('T')[0] // 格式化成日期字符串
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // 遍历记录
  history.value.forEach((item) => {
    const dateStr = new Date(item.createdTime).toISOString().split('T')[0]
    const date = new Date(dateStr)

    // 判断分组逻辑
    if (dateStr === today) {
      groups['今天'].push(item)
    } else if (dateStr === yesterday) {
      groups['昨天'].push(item)
    } else if (now - date < 7 * 24 * 60 * 60 * 1000) {
      groups['前七天'].push(item)
    } else if (date >= currentMonthStart) {
      groups['前三十天'].push(item)
    } else if (date >= lastMonthStart && date <= lastMonthEnd) {
      const month = lastMonthStart.toLocaleString('default', { month: 'long' }) // 上个月月份名
      if (!groups[month]) groups[month] = []
      groups[month].push(item)
    } else {
      const prevMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const prevMonthName = prevMonth.toLocaleString('default', { month: 'long' })
      if (!groups[prevMonthName]) groups[prevMonthName] = []
      groups[prevMonthName].push(item)
    }
  })

  // 对每组的 items 按创建时间降序排序
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => Date.parse(b.createdTime) - Date.parse(a.createdTime))
  })

  // 将对象转换为数组
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0) // 过滤掉没有数据的分组
    .map(([date, items]) => ({ date, items }))
})

// 记录生效的选项
const activeItem = ref(null)

// 初始加载时从路由获取当前item
activeItem.value = routeMap['bot'] ? routeMap['bot'].split('/')[2] : null

// 跳转到具体的ai聊天界面
function jumpToBot(id) {
  if (webSocket.value.status === 'init') {
    // 设置生效的item
    activeItem.value = id
    // 跳转到对应路由
    router.push('/bot/' + id)
    // 记录当前路径
    routeMap['bot'] = '/bot/' + id
  } else {
    window.$notify('消息生成中，请勿切换对话')
  }
}

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

/**
 * 发送请求获取对话列表
 */
async function getBotList() {
  const res = await request.get('/bot/list')
  if (res && res.code === 200) {
    history.value = res.data
  }
}

onMounted(() => {
  // 挂载完成后添加滚动事件监听
  if (navBar.value) {
    navBar.value.addEventListener('scroll', handleScroll)
  }
  getBotList()
  // bus事件
  // 更新列表
  bus.on('update-list', () => {
    getBotList()
  })
  // 跳转到对话
  bus.on('select-bot', (id) => {
    jumpToBot(id)
  })
})
onBeforeUnmount(() => {
  bus.off('update-list')
  bus.off('select-bot')
})
</script>

<template>
  <nav ref="navBar" class="nav scroll-bar" @scroll="handleScroll">
    <div class="addition" @click="jumpToBot('new')">
      <Icon class="icon" name="add" />
      <span>开启新的对话</span>
    </div>
    <div v-for="group of groupedHistory" :key="group.date" class="group">
      <div class="date-header">{{ group.date }}</div>
      <li
        v-for="item of group.items"
        :key="item._id"
        :class="{ active: activeItem == item._id }"
        class="record"
        @click="jumpToBot(item._id)"
      >
        <div class="title">{{ item.title }}</div>
      </li>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  height: calc(100vh - 60px);
  transition: border 0.2s;
  border-top: 1px solid transparent;
  color: var(--text);
  font-family: Microsoft YaHei;

  .addition {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 25px;
    font-size: 16px;
    cursor: pointer;
    font-family: dyh;

    .icon {
      font-size: 18px;
    }

    &:hover {
      background-color: var(--hover);
    }
  }

  .group {
    padding-top: 10px;

    .date-header {
      font-weight: bolder;
      font-size: 12px;
      padding: 5px 25px;
    }
    .record {
      list-style: none;
      padding: 10px 28px;
      cursor: pointer;

      .title {
        font-size: 14px;
      }
      &:last-child {
        margin-bottom: 10px;
      }

      &:hover {
        background-color: var(--hover);
      }
    }

    .active {
      background-color: var(--primary) !important;
      color: var(--btn-text);
    }
  }
}
</style>
