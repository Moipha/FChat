<template>
  <button class="btn" :class="type" @click="emit('click')">{{ label }}</button>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: '按钮'
  },
  type: {
    type: String,
    default: 'default',
    enum: ['primary', 'danger', 'default']
  }
})
const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.btn {
  outline: none;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: bold;
  transition: all 0.2s ease;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.primary {
  background-color: var(--primary);
  color: var(--btn-text);

  &:hover {
    filter: brightness(1.2);
  }
}

.danger {
  background-color: var(--bg);
  color: var(--light-text);
  filter: brightness(0.95);

  &:hover {
    background-color: var(--border);
  }
}

.default {
  background-color: var(--bg);
  color: var(--light-text);
  filter: brightness(0.95);

  &:hover {
    background-color: var(--border);
  }
}
</style>
