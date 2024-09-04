<template>
  <main>
    <div class="register">
      <div ref="signH1" class="secondary-title" @click="hideLogin">Sign up</div>
      <FInput v-model="mail" label="邮箱" reverse-color />
      <FBtn class="btn" label="前往验证" @click="verify" />
    </div>
    <div ref="login" class="login">
      <div ref="loginH1" class="primary-title scale-text" @click="hideLogin">Login</div>
      <FInput v-model="curUser.email" label="邮箱" />
      <FInput v-model="curUser.password" type="password" label="密码" />
      <FBtn class="btn" label="Go!" @click="userLogin" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import FBtn from '@r/components/form/FBtn.vue'
import FInput from '@r/components/form/FInput.vue'
import { ref } from 'vue'
import request from '@r/utils/request'
import md5 from 'md5'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'
import { useSignStore } from '@r/stores/sign'

// 获取store数据
const { user, token } = storeToRefs(useUserStore())
const { newUser, lastSendTime } = storeToRefs(useSignStore())

const curUser = ref({ email: 'young@test.cn', password: '123123' }) // 用户信息
// 用户登录
async function userLogin() {
  const { email, password } = curUser.value
  // 输入校验
  try {
    const res = await request.post('/user/login', { email, password: md5(password) })
    if (res && res.code === 200) {
      // 在本地保存token
      token.value = res.data && res.data.token
      // 本地保存用户信息
      user.value = res.data && res.data.user
      // 打开主界面窗口
      window.api.openNewWindow({
        height: 600,
        width: 900,
        minWidth: 600,
        minHeight: 500
      })
    }
  } catch (err) {
    alert('账号或密码有误')
    console.log(err)
  }
}

// ref元素
const login = ref()
const signH1 = ref()
const loginH1 = ref()

// 切换至注册界面
function hideLogin() {
  login.value.classList.toggle('hide-login')
  signH1.value.classList.toggle('scale-text')
  loginH1.value.classList.toggle('scale-text')
}

// 输入框中的邮箱
const mail = ref('')

// 验证邮箱
async function verify() {
  // 校验邮箱格式
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const ok = reg.test(String(mail.value).toLowerCase())
  if (!ok) {
    alert('邮箱格式有误')
    return
  }
  // 检查邮箱是否已注册
  try {
    const res = await request.get('/user/email', { params: { email: mail.value } })
    if (res.data) {
      alert('该邮箱已被注册')
    } else {
      // 判断上次发送时间
      if (Date.now() - lastSendTime.value < 60 * 1000) {
        alert(`请等待 ${60 - parseInt((Date.now() - lastSendTime.value) / 1000)} 秒后再次发送`)
        return
      }
      // 发送验证邮件
      await request.post('/user/send-verify', { email: mail.value })
      lastSendTime.value = Date.now()
      // 验证通过，保存邮箱至本地
      newUser.value.email = mail.value
      mail.value = ''

      window.api.openDialog({
        route: '/register',
        width: 240,
        height: 320,
        modal: true,
        frame: true
      })
    }
  } catch (e) {
    alert('验证码发送失败')
    console.error(e)
  }
}
</script>

<style lang="scss" scoped>
main {
  background: linear-gradient(-60deg, var(--text), var(--primary));
  color: var(--btn-text);
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;
  overflow: hidden;

  .register {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    align-items: center;

    .secondary-title {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      -webkit-app-region: no-drag;
      cursor: pointer;
      width: 150px;
      margin: 0 auto 50px;
      transition: 0.5s all ease-in-out;
    }

    .btn {
      width: 200px;
      margin-top: 50px;
      font-size: 14px;
    }
  }

  .login {
    background-color: var(--bg);
    border-radius: 60% / 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 600px;
    width: 100%;
    margin-top: 10px;
    transition: all 0.8s ease-in-out;
    position: absolute;
    top: 90px;
    z-index: 2;

    .primary-title {
      color: var(--primary);
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin: 20px auto 50px;
      width: 150px;
      -webkit-app-region: no-drag;
      cursor: pointer;
      transition: 0.5s all ease-in-out;
    }

    .btn {
      width: 200px;
      margin-top: 50px;
    }
  }
}

.hide-login {
  transform: translateY(300px) !important;
}

.scale-text {
  font-size: 36px !important;
  margin-top: 0 !important;
  -webkit-app-region: no-drag;
}
</style>
