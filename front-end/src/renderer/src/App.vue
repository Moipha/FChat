<template>
  <router-view />
</template>

<script setup>
// 载入时获取主题颜色
import { useSettingStore } from './stores/setting'
import { storeToRefs } from 'pinia'

const { theme } = storeToRefs(useSettingStore())

document.body.classList.add(theme.value)
</script>
<style lang="scss" scoped></style>
