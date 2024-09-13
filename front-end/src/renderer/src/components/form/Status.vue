<template>
  <div
    class="status"
    :style="{
      '--dot': value === 'online' ? 'var(--primary)' : 'var(--error)'
    }"
  >
    <div class="status-dot"></div>
    <span class="consolas">{{ value }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps(['value'])
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  align-items: center;

  .status-dot {
    background-color: var(--dot);
    width: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  span {
    font-weight: bolder;
    font-size: 14px;
    color: var(--dot);
    margin-left: 3px;
  }
}
</style>
