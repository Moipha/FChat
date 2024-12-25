<script lang="ts" setup>
defineProps({
  to: {
    type: String,
    default: 'body'
  }
})
const emits = defineEmits(['close'])
const visible = defineModel({
  type: Boolean,
  default: true
})

// 关闭遮罩
function closeMask() {
  visible.value = false
  emits('close')
}
</script>

<template>
  <Teleport :to="to">
    <Transition name="fade">
      <div v-if="modelValue" class="nav-mask" @click="closeMask" />
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.nav-mask {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 5;
  opacity: 0.5;
  -webkit-app-region: no-drag;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
