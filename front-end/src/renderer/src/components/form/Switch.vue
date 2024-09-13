<template>
  <label class="switch" :style="{ '--active': color }">
    <input
      class="input"
      :style="{ fontSize: size + 'px' }"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </label>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 12
  },
  color: {
    type: String,
    default: 'var(--primary)'
  }
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.switch {
  -webkit-app-region: no-drag;
  display: flex;
}

.input {
  appearance: none;
  height: 2.4em;
  width: 4.2em;
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
    background-color: var(--active);

    &::before {
      background-color: var(--btn-text);
      left: calc(100% - (1.9em / 2 + 0.3em));
    }
  }
}
</style>
