<template>
  <main>
    <div class="register">
      <div ref="signH1" class="secondary-title" @click="hideLogin">Sign up</div>
      <FInput v-model="newUser.email" label="邮箱" reverse-color />
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

// 获取store数据
const { user, token } = storeToRefs(useUserStore())

const curUser = ref({ email: 'young@test.cn', password: '123123' }) // 用户信息
const newUser = ref({}) // 新注册用户信息
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
        width: 900
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

// 验证邮箱
function verify() {
  window.api.openDialog({
    route: '/register',
    width: 240,
    height: 320
  })
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
