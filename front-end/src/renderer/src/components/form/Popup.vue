<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  obj: {
    type: Object,
    default: () => {}
  }
})
// 显示状态
const show = defineModel({ type: Boolean })
// 元素
const popupRef = ref(null)
// 监听点击事件
const handleClickOutside = (e) => {
  if (popupRef.value && !popupRef.value.contains(e.target)) {
    show.value = false // 点击非组件区域时关闭弹窗
  }
}

onMounted(() => {
  // 绑定点击事件监听器
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 组件卸载时解绑事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-show="show" ref="popupRef" class="popup">
    <li
      v-for="item of items"
      :key="item.label"
      class="item"
      :class="item.type"
      @click.stop="item.action(obj)"
    >
      <Icon v-if="item.icon" :name="item.icon" class="icon" />
      <span class="label">{{ item.label }}</span>
    </li>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  position: absolute;
  width: 100px;
  background-color: var(--bg);
  color: var(--text);
  border: 1.5px solid var(--border);
  border-radius: 4px;
  z-index: 4;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  .item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px;
    font-size: 14px;

    &:hover {
      background-color: var(--hover);
    }
  }
  .danger {
    color: var(--error);
  }
}
</style>
