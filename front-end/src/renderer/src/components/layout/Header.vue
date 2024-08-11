<template>
  <header>
    <div class="title">{{ friend.username }}</div>
    <Status class="status" :value="friend.status" />
    <div class="else-btn">
      <Icon class="icon" name="else" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import Icon from '@r/components/form/Icon.vue'
import Status from '@r/components/form/Status.vue'
// 接收用户对象
defineProps({
  friend: {
    type: Object,
    required: true,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 60px;
  background-color: var(--bg);
  -webkit-app-region: drag;
  transition: 0.2s all;
  border-bottom: 1px solid var(--border);

  .status {
    margin-left: 20px;
    margin-top: 3px;
  }

  .title {
    width: calc(100% - 160px);
    font-size: 16px;
    font-weight: bolder;
    color: var(--text);
    padding-left: 20px;
    transition: 0.2s all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 12px;
  }

  .else-btn {
    position: absolute;
    right: 10px;
    top: 30px;
    color: var(--light-text);
    font-size: 25px;
    -webkit-app-region: no-drag;
    cursor: pointer;

    .icon {
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.2);
        color: var(--primary);
      }
    }
  }
}
</style>
