<template>
  <div class="form-input">
    <label>{{ label }}</label>
    <input
      spellcheck="false"
      :type
      :style="customStyle"
      :value="value || modelValue"
      :placeholder
      :disabled
      :class="{ disabled }"
      required
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String
  },
  value: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.form-input {
  display: flex;
  flex-direction: column;
  -webkit-app-region: no-drag;

  label {
    font-size: 1.25em;
    font-family: dyh;
    letter-spacing: 2px;
  }

  input {
    margin-top: 0.625em;
    padding: 0.94em 1.25em;
    line-height: 1em;
    font-size: 1em;
    outline: none;
    border-radius: 0.625em;
    border: 1.5px solid var(--border);
    background-color: var(--bg);
    transition: all 0.2s ease;
    color: var(--text);

    &:focus {
      border: 1.5px solid var(--primary);
    }

    &::selection {
      background-color: var(--primary);
      color: var(--btn-text);
    }
  }

  .disabled {
    cursor: not-allowed;
    color: var(--light-text);
    opacity: 0.9;
  }
}
</style>
