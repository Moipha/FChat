<template>
  <div class="container">
    <div>{{ friend.username }}</div>
    <div>{{ friend._id }}</div>
    <div>{{ friend.email }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'

// 获取好友列表
const { friends } = storeToRefs(useUserStore())

// 接收id
const props = defineProps(['id'])

// 接收好友信息
const friend = ref({})
friend.value = friends.value.find((item) => item._id === props.id)
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--text);
  -webkit-app-region: drag;
}
</style>
