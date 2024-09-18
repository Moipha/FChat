<template>
  <form class="form" :style="{ right: showPass ? '0' : '-100%' }">
    <span class="title">设置您的登录口令</span>
    <p class="subtitle">口令需6位以上，含数字、字母、特殊符号中的至少两种</p>
    <Input v-model="user.password" class="input" label="密码" type="password" />
    <Input v-model="user.confirm" class="input" label="确认密码" type="password" />
    <Btn type="primary" class="verify-button" label="注册" @click="signUp" />
  </form>
</template>

<script lang="ts" setup>
import Btn from '@r/components/form/Btn.vue'
import Input from '@r/components/form/Input.vue'
import { ref } from 'vue'
import { useSignStore } from '@r/stores/sign'
import { storeToRefs } from 'pinia'
import request from '@r/utils/request'
import md5 from 'md5'

const { newUser } = storeToRefs(useSignStore())
// 用户
const user = ref({})

defineProps({
  showPass: {
    type: Boolean
  }
})

// 注册用户
function signUp() {
  // 校验
  if (user.value.password !== user.value.confirm) return window.$notify('两次输入的口令不一致')
  if (user.value.password.length < 6) return window.$notify('口令长度需大于等于6位')
  const { email } = newUser.value
  // 注册
  const res = request.post('/user', { email, password: md5(user.value.password) })
  if (res.code !== 200) {
    window.api.returnRegister(true)
    window.api.closeDialog()
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  color: var(--text);
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  top: 0;
  right: -100%;
  position: absolute;
  transition: all 0.4s;
  -webkit-app-region: drag;

  .title {
    font-size: 1.3em;
    color: rgb(15, 15, 15);
    font-family: dyh;
  }

  .subtitle {
    font-size: 0.66em;
    width: 75%;
    color: black;
    line-height: 25px;
    text-align: center;
    font-family: Microsoft-YaHei;
    margin-top: 20px;
  }

  .input {
    width: 75%;
    font-size: 0.6em;
  }

  .verify-button {
    width: 55%;
    font-size: 14px;
    margin: 20px auto 0;
  }
}
</style>
