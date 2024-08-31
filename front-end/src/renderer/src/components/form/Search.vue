<template>
  <div class="container">
    <input checked="" class="checkbox" type="checkbox" />
    <div class="main-box">
      <div class="iconContainer">
        <Icon name="search" />
      </div>
      <input
        class="search_input consolas"
        :placeholder
        type="text"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@r/components/form/Icon.vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  box-sizing: border-box;
  width: fit-content;
  -webkit-app-region: no-drag;

  .checkbox {
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 17px;
    top: 10px;
    z-index: 9;
    cursor: pointer;
    appearance: none;

    &:focus {
      border: none;
      outline: none;
    }

    &:checked {
      right: 10px;

      ~ .main-box {
        width: 50px;

        .search_input {
          width: 0;
          height: 0;
        }

        .iconContainer {
          padding-right: 8px;
        }
      }
    }
  }

  .main-box {
    box-sizing: border-box;
    position: relative;
    width: 330px;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    border-radius: 160px;
    background-color: var(--primary);
    transition: all 0.3s ease;

    .iconContainer {
      box-sizing: border-box;
      width: fit-content;
      transition: all 0.3s ease;
      color: var(--btn-text);
      font-size: 20px;
    }

    .search_input {
      box-sizing: border-box;
      height: 100%;
      width: 270px;
      background-color: transparent;
      border: none;
      outline: none;
      padding-bottom: 4px;
      padding-left: 10px;
      font-size: 1em;
      color: var(--btn-text);
      transition: all 0.3s ease;

      &::placeholder {
        color: var(--btn-text);
        opacity: 0.7;
      }
    }
  }
}
</style>
