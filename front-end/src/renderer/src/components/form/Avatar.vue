<template>
  <img
    loading="lazy"
    :src="src"
    alt="Avatar"
    :style="{
      clipPath: shape === 'circle' ? `circle(${size / 2}px)` : 'none',
      width: `${size}px`,
      height: `${size}px`
    }"
  />
</template>

<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    default: '',
    required: false
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
  object-fit: cover;
}
</style>
