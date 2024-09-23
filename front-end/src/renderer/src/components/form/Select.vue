<template>
  <select :value="modelValue" @change="emits('update:modelValue', $event.target.value)">
    <option v-for="item in list" :key="item.key" :value="item.value">
      {{ item.key }}
    </option>
  </select>
</template>

<script lang="ts" setup>
defineProps({
  list: {
    type: [Object],
    default: () => {}
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
select {
  width: 100%;
  height: 2em;
  font-size: 0.9em;
  padding-left: 0.2em;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1.5px solid var(--border);
  transition: 0.2s all;
  background-color: var(--bg);
  color: var(--text);

  option {
    height: 40px;

    &:hover {
      background-color: var(--primary);
    }
  }

  &:focus {
    border: 1.5px solid var(--primary);
  }
}
</style>
