<script setup>
import Popup from '@r/components/form/Popup.vue'
import Dialog from '@r/components/layout/Dialog.vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
 * popup
 */
const showPopup = ref(false)
// 当前点击的对话信息
const curItem = ref({})
// 弹出框距顶部的距离
const top = ref(0)
// 正在编辑标题的对话
const editingBot = ref()
// 临时编辑中的标题
const tempTitle = ref('')
// 输入框元素
const inputRef = ref(null)
// 确认删除弹窗
const showDialog = ref(false)
// 打开popup
function openPopup(item, e) {
  // 获取目标元素的相关位置
  const targetElem = e.target.parentNode.parentNode
  const rect = targetElem.getBoundingClientRect()
  const elementHeight = rect.bottom - rect.top

  // 计算 1/4 和 3/4 的位置
  const quarterHeight = elementHeight / 4
  const threeQuarterHeight = (elementHeight * 3) / 4

  // 计算页面顶部到目标元素的 1/4 高度的位置
  const targetPosition = rect.bottom - quarterHeight
  const y1 = targetPosition + window.scrollY

  // 获取页面底部到该位置的距离
  const bottomSpace = window.innerHeight - rect.bottom + quarterHeight

  // 判断是否需要调整位置
  const y = bottomSpace < 80 ? rect.bottom - threeQuarterHeight + window.scrollY - 80 : y1

  // 设置位置
  top.value = y

  // 设置当前点击的对话信息
  curItem.value = item
  showPopup.value = true
}
// 取消编辑
function cancelEdit() {
  editingBot.value = ''
  curItem.value = {}
  showPopup.value = false
}
// 修改标题
async function editTitle(id) {
  const res = await request.put('/bot/', {
    botId: id,
    title: tempTitle.value
  })
  if (res && res.code === 200) {
    window.$notify('修改成功')
    getBotList()
    cancelEdit()
  }
}
// 删除对话
async function onConfirmDialog() {
  if (!curItem.value._id) return
  const res = await request.delete('/bot/' + curItem.value._id)
  if (res && res.code === 200) {
    // 如果当前对话正在聊天，则退出聊天
    if (activeItem.value === curItem.value._id) {
      router.push('/bot/new')
      routeMap['bot'] = '/bot/new'
    }
    getBotList()
    showDialog.value = false
    curItem.value = {}
    window.$notify('删除成功')
  }
}
// 取消删除
function onCancelDialog() {
  showDialog.value = false
}
// popup中的选项
const popupOptions = [
  {
    label: '删除对话',
    icon: 'delete',
    action: () => {
      showDialog.value = true
    },
    type: 'danger'
  },
  {
    label: '重命名',
    icon: 'edit',
    action: (bot) => {
      editingBot.value = bot._id
      tempTitle.value = bot.title
      showPopup.value = false
      nextTick(() => {
        inputRef.value[0].focus()
      })
    }
  }
]

/**
 * 获取对话列表
 */
async function getBotList() {
  const res = await request.get('/bot/list')
  if (res && res.code === 200) {
    history.value = res.data
  }
}

/**
 * 滚动条事件
 */
function handleScroll(e) {
  // 判断是否在顶端
  if (e.elements().scrollEventElement.scrollTop !== 0) {
    containerRef.value.classList.add('add-border')
  } else {
    containerRef.value.classList.remove('add-border')
  }
}
const containerRef = ref(null)

onMounted(() => {
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
  <div ref="containerRef" class="bot-container no-border">
    <OverlayScrollbarsComponent
      :options="{ scrollbars: { autoHide: 'scroll' } }"
      defer
      element="div"
      :events="{ scroll: handleScroll }"
    >
      <nav class="nav">
        <div class="addition" @click="jumpToBot('new')">
          <Icon class="icon" name="add" />
          <span>开启新的对话</span>
        </div>
        <div v-for="group of groupedHistory" :key="group.date" class="group">
          <div class="date-header">{{ group.date }}</div>
          <li
            v-for="item of group.items"
            :key="item._id"
            :class="{ active: activeItem == item._id, hover: showPopup && item._id == curItem._id }"
            class="record"
            @click="jumpToBot(item._id)"
          >
            <template v-if="editingBot === item._id">
              <input
                ref="inputRef"
                v-model="tempTitle"
                type="text"
                @keydown.enter="editTitle(item._id)"
                @click.stop
                @blur="cancelEdit"
              />
              <div class="title">$nbsp</div>
            </template>
            <template v-else>
              <div class="title">{{ item.title }}</div>
              <Icon class="icon" name="else" @click.stop="openPopup(item, $event)" />
            </template>
          </li>
        </div>
      </nav>
    </OverlayScrollbarsComponent>
    <Popup
      v-model="showPopup"
      :style="{ top: top + 'px' }"
      :items="popupOptions"
      :obj="curItem"
      class="popup"
    />
    <Dialog
      v-model="showDialog"
      title="删除聊天？"
      confirm-label="删除"
      @cancel="onCancelDialog"
      @confirm="onConfirmDialog"
    >
      <div class="confirm">
        这会删除<span>{{ curItem.title }}</span
        >并清除该对话的所有聊天。
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.bot-container {
  height: calc(100vh - 61px);
  border-top: 1px solid transparent;
  transition: border 0.2s;
}

.addition {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 25px;
  font-size: 16px;
  cursor: pointer;
  font-family: dyh;
  color: var(--text);

  .icon {
    font-size: 18px;
  }

  &:hover {
    background-color: var(--hover);
  }
}
.nav {
  height: calc(100vh - 60px);
  transition: border 0.2s;
  border-top: 1px solid transparent;
  color: var(--text);
  font-family: Microsoft YaHei;

  .group {
    padding-top: 10px;

    .date-header {
      font-weight: bolder;
      font-size: 12px;
      padding: 5px 25px;
    }
    .record {
      list-style: none;
      padding: 0px 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      overflow: hidden;
      line-height: 40px;

      .title {
        font-size: 14px;
      }
      input {
        border: 1.5px solid var(--text);
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        padding: 5px 10px;
        position: absolute;
        left: 3%;
        right: 3%;
        background-color: var(--bg);
        color: var(--text);
      }

      &:last-child {
        margin-bottom: 10px;
      }

      &:hover {
        background-color: var(--hover);

        .icon {
          display: flex;
        }
      }

      .icon {
        display: none;
        font-size: 25px;
        transition: all 0.2s;
        padding: 5px;
        margin-left: auto;
        margin-right: -18px;

        &:hover {
          scale: 1.2;
        }
      }
    }

    .hover {
      background-color: var(--hover);

      .icon {
        display: flex;
      }
    }

    .active {
      background-color: var(--primary) !important;
      color: var(--btn-text);
    }
  }
}

.popup {
  right: 30px;
  transform: translate(100%);
}

.confirm {
  font-size: 16px;
  font-family: Microsoft YaHei;
  margin: 0 10px;

  span {
    color: var(--primary);
    font-weight: bold;
    margin: 0 5px;
  }
}
</style>
