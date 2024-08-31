<template>
  <div class="otp-Form">
    <span class="mainHeading">请输入验证码</span>
    <p class="otpSubheading">我们已向您的邮箱中发送了四位验证码，请注意查收</p>
    <div class="inputContainer">
      <input
        id="otp-input1"
        ref="input1"
        v-model="verifyCode[0]"
        required="required"
        maxlength="1"
        type="text"
        class="otp-input"
        @input="handleInput1"
      />
      <input
        id="otp-input2"
        ref="input2"
        v-model="verifyCode[1]"
        required="required"
        maxlength="1"
        type="text"
        class="otp-input"
        @input="handleInput2"
      />
      <input
        id="otp-input3"
        ref="input3"
        v-model="verifyCode[2]"
        required="required"
        maxlength="1"
        type="text"
        class="otp-input"
        @input="handleInput3"
      />
      <input
        id="otp-input4"
        ref="input4"
        v-model="verifyCode[3]"
        required="required"
        maxlength="1"
        type="text"
        class="otp-input"
        @input="handleInput4"
      />
    </div>
    <FBtn class="verifyButton" label="验证" @click="verify" />
    <p class="resendNote">
      未收到验证码？<button
        :disabled="waitTime != 0"
        :class="waitTime != 0 ? 'disabled' : ''"
        class="resendBtn"
        @click="resend"
      >
        重新发送
        <span v-if="waitTime != 0"> {{ waitTime }}s</span>
      </button>
    </p>
  </div>
</template>

<script lang="ts" setup>
import FBtn from '@r/components/form/FBtn.vue'
import { useRouter } from 'vue-router'
import { useSignStore } from '@r/stores/sign'
import { storeToRefs } from 'pinia'
import request from '@r/utils/request'
import { ref } from 'vue'

// 获取store中保存的新用户
const { newUser, lastSendTime } = storeToRefs(useSignStore())
const router = useRouter()

// 验证码
const verifyCode = ref([])

// 剩余等待时间
const waitTime = ref(0)

// 每秒递减
function calculateTime() {
  if (lastSendTime.value) {
    waitTime.value = 60 - parseInt((Date.now() - lastSendTime.value) / 1000)
    setInterval(() => {
      if (waitTime.value <= 0) return (waitTime.value = 0)
      waitTime.value -= 1
    }, 1000)
  }
}
calculateTime()
// 输入框
const input1 = ref(null)
const input2 = ref(null)
const input3 = ref(null)
const input4 = ref(null)

// 输入框聚焦
function handleInput1(e) {
  if (e.inputType !== 'deleteContentBackward') {
    input2.value.focus()
  }
}
function handleInput2(e) {
  if (e.inputType !== 'deleteContentBackward') {
    input3.value.focus()
  } else {
    input1.value.focus()
  }
}
function handleInput3(e) {
  if (e.inputType !== 'deleteContentBackward') {
    input4.value.focus()
  } else {
    input2.value.focus()
  }
}
function handleInput4(e) {
  if (e.inputType === 'deleteContentBackward') {
    input3.value.focus()
  }
}

// 检查验证码
async function verify() {
  const email = newUser.value.email
  const code = verifyCode.value.join('')
  try {
    const res = await request.post('/user/verify', { email, code })
    if (res.code === 200) {
      router.push('/set-pass')
    } else {
      alert('验证码错误')
    }
  } catch (err) {
    alert('请求校验失败')
    console.error(err)
  }
}

// 重发验证码
async function resend() {
  try {
    // 发送验证邮件
    await request.post('/user/send-verify', { email: newUser.value.email })
    // 更新发送时间
    lastSendTime.value = Date.now()
    calculateTime()
  } catch (err) {
    alert('发送验证码失败')
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
  -webkit-app-region: drag;

  .mainHeading {
    font-size: 1.1em;
    color: rgb(15, 15, 15);
    font-weight: 700;
  }

  .otpSubheading {
    font-size: 0.7em;
    color: black;
    line-height: 17px;
    text-align: center;
  }

  .inputContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;

    .otp-input {
      background-color: var(--text);
      opacity: 0.1;
      width: 30px;
      height: 30px;
      text-align: center;
      border: none;
      border-radius: 7px;
      outline: none;
      font-weight: 600;

      &:focus,
      &:valid {
        background-color: var(--primary);
        color: var(--btn-text);
        opacity: 1;
        transition-duration: 0.3s;
      }
    }
  }

  .verifyButton {
    width: 100%;
    font-size: 14px;
  }

  .resendNote {
    font-size: 0.7em;
    color: var(--text);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    -webkit-app-region: no-drag;
  }

  .resendBtn {
    background-color: transparent;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 700;
  }

  .disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}
</style>
