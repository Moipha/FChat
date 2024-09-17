<template>
  <div class="form-input">
    <label>邮箱</label>
    <input
      spellcheck="false"
      :type
      :placeholder
      :value="modelValue"
      @input="emit('update:modelValue')"
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
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.form-input {
  display: flex;
  flex-direction: column;

  label {
    font-size: 20px;
    font-family: dyh;
    letter-spacing: 2px;
  }

  input {
    margin-top: 10px;
    padding: 15px 20px;
    line-height: 16px;
    font-size: 16px;
    outline: none;
    border-radius: 10px;
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
}
</style>
