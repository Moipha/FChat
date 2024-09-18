<template>
  <div class="register-container">
    <div class="otp-form" :style="{ left: showPass ? '-100%' : '0' }">
      <span class="title">请输入验证码</span>
      <p class="subtitle">我们已向您的邮箱中发送了四位验证码，请注意查收</p>
      <div class="input-container">
        <input
          id="otp-input1"
          ref="input1"
          v-model="verifyCode[0]"
          required="required"
          maxlength="1"
          spellcheck="false"
          type="text"
          class="otp-input"
          @input="handleInput1"
        />
        <input
          id="otp-input2"
          ref="input2"
          v-model="verifyCode[1]"
          spellcheck="false"
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
          spellcheck="false"
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
          spellcheck="false"
          required="required"
          maxlength="1"
          type="text"
          class="otp-input"
          @input="handleInput4"
        />
      </div>
      <Btn type="primary" class="verify-btn" label="验证" @click="verify" />
      <p class="resend-note">
        未收到验证码?<button
          :disabled="waitTime != 0"
          :class="waitTime != 0 ? 'disabled' : ''"
          class="resend-btn"
          @click="resend"
        >
          重新发送
          <span v-if="waitTime != 0"> {{ waitTime }}s</span>
        </button>
      </p>
    </div>
    <SetPass :show-pass />
  </div>
  <Titlebar :minimize="false" :maximize="false" :height="15" />
</template>

<script lang="ts" setup>
import Btn from '@r/components/form/Btn.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
import SetPass from '@r/views/children/SetPass.vue'
import { useSignStore } from '@r/stores/sign'
import { storeToRefs } from 'pinia'
import request from '@r/utils/request'
import { ref } from 'vue'

// 获取store中保存的新用户
const { newUser, lastSendTime } = storeToRefs(useSignStore())

// 验证码
const verifyCode = ref([])

// 剩余等待时间
const waitTime = ref(0)

// 左滑
const showPass = ref(false)

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
      showPass.value = true
    } else {
      window.$notify('验证码错误')
    }
  } catch (err) {
    window.$notify('请求校验失败')
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
    window.$notify('发送验证码失败')
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  width: 100vw;
  height: 100vh;

  .otp-form {
    width: 100%;
    height: 100%;
    background-color: var(--bg);
    color: var(--text);
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: absolute;
    top: 0;
    left: 0;
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
    }

    .input-container {
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
        width: 35px;
        aspect-ratio: 1;
        text-align: center;
        border: none;
        border-radius: 10px;
        outline: none;
        font-family: consolas;
        font-size: 18px;

        &:focus,
        &:valid {
          background-color: var(--primary);
          color: var(--btn-text);
          opacity: 1;
          transition-duration: 0.3s;
        }
      }
    }

    .verify-btn {
      margin: 20px auto -10px;
      width: 55%;
      font-size: 14px;
    }

    .resend-note {
      font-size: 0.7em;
      color: var(--text);
      font-family: Microsoft-YaHei;
      display: flex;
      justify-content: center;
      -webkit-app-region: no-drag;

      .resend-btn {
        background-color: transparent;
        border: none;
        color: var(--primary);
        cursor: pointer;
        font-size: 1.1em;
        font-family: dyh;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>
