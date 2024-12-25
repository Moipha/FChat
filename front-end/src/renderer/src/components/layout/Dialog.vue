<script lang="ts" setup>
import Mask from '@r/components/layout/Mask.vue'
import Btn from '@r/components/form/Btn.vue'

defineProps({
  title: {
    type: String,
    default: '标题'
  },
  thirdBtn: {
    type: Boolean,
    default: false
  },
  cancelLabel: {
    type: String,
    default: '取消'
  },
  confirmLabel: {
    type: String,
    default: '发送'
  },
  thirdLabel: {
    type: String,
    default: '按钮'
  }
})

const emits = defineEmits(['cancel', 'confirm', 'third'])

const visible = defineModel({
  type: Boolean,
  default: false
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog">
      <h1 class="title">{{ title }}</h1>
      <slot></slot>
      <div class="footer">
        <Btn v-if="thirdBtn" class="third" @click="emits('third')">{{ thirdLabel }}</Btn>
        <Btn class="cancel" @click="emits('cancel')">{{ cancelLabel }}</Btn>
        <Btn type="primary" @click="emits('confirm')">{{ confirmLabel }}</Btn>
      </div>
    </div>
  </Teleport>
  <Mask v-model="visible" @close="emits('cancel')" />
</template>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 100;
  background-color: var(--bg);
  width: 400px;
  height: fit-content;
  border-radius: 10px;
  display: flex;
  padding: 15px;
  flex-flow: column wrap;
  border: solid 1.5px var(--border);
  color: var(--text);

  .title {
    font-size: 18px;
    margin: 0 10px 20px;
  }

  .footer {
    display: flex;
    margin: 20px 0 0 10px;
    font-size: 15px;

    .third {
      margin-right: auto;
    }
    .cancel {
      margin-left: auto;
    }
  }
}
</style>
