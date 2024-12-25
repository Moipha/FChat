<template>
  <div class="checkbox-container">
    <input
      id="checkbox"
      type="checkbox"
      :checked="modelValue"
      @change="emits('update:modelValue', $event.target.checked)"
    />
    <label for="checkbox">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean
  },
  label: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.checkbox-container {
  display: flex;
  align-items: center;

  label {
    font-size: 16.5px;
    cursor: pointer;
    font-family: dyh;
  }

  input {
    outline: none;
    appearance: none;
    width: 18px;
    aspect-ratio: 1;
    border: 2px solid var(--primary);
    border-radius: 5px;
    background-color: transparent;
    display: inline-block;
    position: relative;
    margin-right: 5px;
    cursor: pointer;

    &:checked {
      &::before {
        transform: translate(-50%, -50%) scale(1);
      }
    }

    &::before {
      content: '';
      background-color: var(--primary);
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 10px;
      aspect-ratio: 1;
      border-radius: 3px;
      transition: all 0.15s ease-in-out;
    }
  }
}
</style>
