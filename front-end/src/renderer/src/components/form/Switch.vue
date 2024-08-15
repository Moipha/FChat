<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </label>
</template>

<script lang="ts" setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.switch {
  -webkit-app-region: no-drag;
  display: flex;
}

input[type='checkbox'] {
  appearance: none;
  height: 2rem;
  width: 3.5rem;
  background-color: var(--border);
  position: relative;
  border-radius: 0.2em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &::before {
    content: '';
    display: block;
    height: 1.9em;
    width: 1.9em;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: calc(1.9em / 2 + 0.3em);
    background-color: var(--light-text);
    border-radius: 0.2em;
    transition:
      all 0.3s ease,
      background-color 0.2s ease;
  }

  &:checked {
    background-color: var(--primary);

    &::before {
      background-color: var(--btn-text);
      left: calc(100% - (1.9em / 2 + 0.3em));
    }
  }
}
</style>
