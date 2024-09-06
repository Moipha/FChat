<template>
  <div class="container">
    <input :checked="hide" class="checkbox" type="checkbox" @input="changeHide" />
    <div class="main-box">
      <div class="iconContainer">
        <Icon v-show="!hide" name="close" />
        <Icon v-show="hide" name="search" />
      </div>
      <input
        spellcheck="false"
        class="search_input consolas"
        :placeholder
        type="text"
        :value="modelValue"
        @input="combine"
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
  },
  hide: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits({
  'update:modelValue': {},
  'update:hide': {},
  input: {
    default: () => {}
  }
})

// 修改输入框状态
function changeHide(e) {
  emit('update:hide', e.target.checked)
  if (e.target.checked) {
    setTimeout(() => {
      emit('update:modelValue', '')
      emit('input', e.target.value)
    }, 300)
  }
}

// 触发输入框变化
function combine(e) {
  emit('update:modelValue', e.target.value)
  emit('input', e.target.value)
}
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
    width: 400px;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    border-radius: 160px;
    background-color: var(--primary);
    transition: all 0.5s ease;

    .iconContainer {
      box-sizing: border-box;
      width: fit-content;
      transition: all 0.5s ease;
      color: var(--btn-text);
      font-size: 20px;
    }

    .search_input {
      box-sizing: border-box;
      height: 100%;
      width: 340px;
      background-color: transparent;
      border: none;
      outline: none;
      padding-bottom: 4px;
      padding-left: 10px;
      font-size: 1em;
      color: var(--btn-text);
      transition: all 0.5s ease;

      &::placeholder {
        color: var(--btn-text);
        opacity: 0.7;
      }
    }
  }
}
</style>
