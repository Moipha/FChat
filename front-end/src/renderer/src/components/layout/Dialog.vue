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
    default: '确认'
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
    <Transition>
      <div v-if="visible" class="dialog">
        <h1 class="title">{{ title }}</h1>
        <slot></slot>
        <div class="footer">
          <Btn v-if="thirdBtn" class="third" @click="emits('third')">{{ thirdLabel }}</Btn>
          <Btn class="cancel" @click="emits('cancel')">{{ cancelLabel }}</Btn>
          <Btn type="primary" @click="emits('confirm')">{{ confirmLabel }}</Btn>
        </div>
      </div>
    </Transition>
  </Teleport>
  <Mask v-model="visible" @close="emits('cancel')" />
</template>

<style lang="scss" scoped>
.dialog {
  width: 40vw;
  max-width: 580px;
  min-width: 400px;
  height: fit-content;
  border-radius: 10px;
  border: solid 1.5px var(--border);
  padding: 15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  z-index: 100;
  color: var(--text);
  background-color: var(--bg);
  display: flex;
  flex-flow: column wrap;

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

.v-enter-active,
.v-leave-active {
  transition: 0.2s all ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5);
}
</style>
