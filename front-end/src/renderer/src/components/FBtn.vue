<template>
  <button @click="test">{{ label }}</button>
</template>

<script lang="ts" setup>
defineProps(['label'])
const emit = defineEmits(['click'])
function test() {
  emit('click')
}
</script>

<style lang="scss" scoped>
button {
  font-size: 18px;
  letter-spacing: 2px;
  display: inline-block;
  text-align: center;
  font-weight: bold;
  padding: 5px 20px;
  border: 3px solid var(--primary);
  border-radius: 5px;
  position: relative;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.1);
  color: var(--btn-text);
  background-color: var(--primary);
  text-decoration: none;
  transition: 0.3s ease all;
  z-index: 1;
  -webkit-app-region: no-drag;
  cursor: pointer;

  &::before {
    transition: 0.5s all ease;
    position: absolute;
    top: 0;
    left: 50%;
    right: 50%;
    bottom: 0;
    opacity: 0;
    content: '';
    background-color: var(--bg);
    z-index: -1;
    border-radius: 5px;
  }

  &:hover,
  &:focus {
    color: var(--text);
  }

  &:hover::before,
  &:focus::before {
    transition: 0.5s all ease;
    left: 0;
    right: 0;
    opacity: 1;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>
