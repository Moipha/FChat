<template>
  <img
    loading="lazy"
    :width="`${size}px`"
    src="@r/assets/img/test1.jpg"
    alt="Avatar"
    :style="shape === 'circle' ? `clip-path: circle(${size / 2}px)` : ''"
  />
</template>

<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    default: '',
    required: true
  },
  size: {
    type: Number,
    default: 50,
    required: false
  },
  // 图片形状，枚举类型: square, circle
  shape: {
    type: String,
    default: 'square',
    validator: (value) => {
      return ['square', 'circle'].includes(value)
    },
    required: false
  }
})
</script>

<style lang="scss" scoped>
img {
  aspect-ratio: 1;
}
</style>
