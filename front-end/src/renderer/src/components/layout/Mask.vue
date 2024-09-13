<template>
  <Teleport :to="to">
    <Transition name="fade">
      <div v-if="modelValue" class="nav-mask" @click="emit('update:modelValue', false)" />
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: 'body'
  }
})
const emit = defineEmits(['update:modelValue'])
</script>

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
