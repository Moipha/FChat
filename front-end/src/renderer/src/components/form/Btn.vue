<template>
  <button class="btn" :class="type" @click="emit('click')">
    <slot>{{ label }}</slot>
  </button>
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
  padding: 0.625em 0.94em;
  border-radius: 4px;
  margin-right: 0.625em;
  font-size: 1em;
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
