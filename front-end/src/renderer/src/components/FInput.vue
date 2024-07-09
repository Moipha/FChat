<template>
  <div class="input-container" :class="reverseColor ? 'reverse-color' : 'normal-color'">
    <input
      id="input"
      :value="modelValue"
      :type
      required
      @input="emit('update:modelValue', $event.target.value)"
    />
    <label for="input" class="label">{{ label }}</label>
    <div class="underline"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  reverseColor: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['input', 'update:modelValue'])
</script>

<style lang="scss" scoped>
.reverse-color {
  --p: var(--btn-text);
  --bt: var(--bg);
  --t: var(--btn-text);
}
.normal-color {
  --p: var(--primary);
  --bt: var(--btn-text);
  --t: var(--text);
}
.input-container {
  position: relative;
  margin: 20px auto;
  width: 240px;
  -webkit-app-region: no-drag;

  input {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid var(--p);
    opacity: 0.5;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: var(--t);

    &:focus,
    &:valid {
      opacity: 1;
    }

    &:focus ~,
    &:valid ~ {
      .label {
        top: -20px;
        font-size: 16px;
        opacity: 1;
      }

      .underline {
        transform: scaleX(1);
      }
    }

    &::selection {
      background-color: var(--p);
      color: var(--bt);
    }
  }

  .label {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--p);
    opacity: 0.8;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: var(--p);
    transform: scaleX(0);
    transition: all 0.3s ease;
  }
}
</style>
