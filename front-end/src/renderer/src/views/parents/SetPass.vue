<template>
  <form class="otp-Form">
    <span class="mainHeading">设置您的登录口令</span>
    <p class="otpSubheading">口令需6位以上，含数字、字母、特殊符号中的至少两种</p>
    <FInput v-model="user.password" class="passInput" label="密码" type="password" />
    <FInput v-model="user.confirm" class="passInput" label="确认密码" type="password" />
    <FBtn class="verifyButton" label="注册" @click="signUp" />
  </form>
</template>

<script lang="ts" setup>
import FBtn from '@r/components/form/FBtn.vue'
import FInput from '@r/components/form/FInput.vue'
import { ref } from 'vue'
import { useSignStore } from '@r/stores/sign'
import { storeToRefs } from 'pinia'
import request from '@r/utils/request'
import md5 from 'md5'

const { newUser } = storeToRefs(useSignStore())
// 用户
const user = ref({})

// 注册用户
function signUp() {
  // 校验
  if (user.value.password !== user.value.confirm) return alert('两次输入的口令不一致')
  if (user.value.password.length < 6) return alert('口令长度需大于等于6位')
  const { email } = newUser.value
  // 注册
  try {
    const res = request.post('/user', { email, password: md5(user.value.password) })
    if (res.code !== 200) {
      alert('注册成功')
      window.api.closeDialog()
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<style lang="scss" scoped>
.otp-Form {
  width: 230px;
  height: 300px;
  background-color: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  gap: 20px;
  position: relative;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  -webkit-app-region: drag;

  .mainHeading {
    font-size: 1.1em;
    color: rgb(15, 15, 15);
    font-weight: 700;
    margin-top: -20px;
  }

  .otpSubheading {
    font-size: 0.7em;
    color: black;
    line-height: 17px;
    text-align: center;
    margin: 10px;
  }

  .passInput {
    width: 90%;
    margin: 3px;
    font-size: 10px;
  }

  .verifyButton {
    width: 60%;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
