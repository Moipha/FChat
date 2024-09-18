<template>
  <main>
    <LoginCard />
    <div class="login">
      <div class="drag" />
      <Input
        v-model="curUser.email"
        class="input-container"
        placeholder="name@mail.com"
        label="邮箱"
      />
      <Input
        v-model="curUser.password"
        class="input-container"
        placeholder="你的密码"
        label="密码"
        type="password"
      />
      <div class="option">
        <div class="checkbox-container">
          <input id="checkbox" type="checkbox" />
          <label for="checkbox">记住账号</label>
        </div>
        <span class="word-btn">忘记密码?</span>
      </div>
      <Btn class="btn" type="primary" @click="userLogin">登录</Btn>
      <div class="or">
        <hr />
        <span>或</span>
        <hr />
      </div>
      <div class="third-party">
        <Btn> <Icon class="icon" name="wechat" />使用微信登录 </Btn>
        <Btn> <Icon class="icon" name="github" />使用Github登录 </Btn>
      </div>
      <div class="tip">
        <span>没有账号？</span>
        <span class="word-btn">点击注册</span>
      </div>
    </div>
  </main>
  <Titlebar :minimize="false" :maximize="false" :height="15" />
</template>

<script lang="ts" setup>
import Btn from '@r/components/form/Btn.vue'
import LoginCard from '@r/components/layout/LoginCard.vue'
import Input from '@r/components/form/Input.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
import { ref } from 'vue'
import request from '@r/utils/request'
import md5 from 'md5'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@r/stores/user'
import { useSignStore } from '@r/stores/sign'
import { useSettingStore } from '@r/stores/setting'

// 获取store数据
const { user, token } = storeToRefs(useUserStore())
const { newUser, lastSendTime } = storeToRefs(useSignStore())
const { nav, routeMap } = storeToRefs(useSettingStore())

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
      // 修改nav
      nav.value = 'chat'
      // 打开主界面窗口
      window.api.openNewWindow({
        height: 600,
        width: 900,
        minWidth: 600,
        minHeight: 500,
        route: routeMap.value['chat']
      })
    }
  } catch (err) {
    curUser.value.password = ''
  }
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
  background-color: var(--bg);
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;
  overflow: hidden;
  display: flex;
  color: var(--text);

  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50%;
    padding: 20px 10px;
    box-sizing: border-box;
    -webkit-app-region: no-drag;

    .drag {
      height: 30px;
      width: 100%;
      position: absolute;
      -webkit-app-region: drag;
      top: 0;
    }

    .input-container {
      padding: 10px 20px;
      width: 80%;
    }

    .option {
      margin: 10px;
      display: flex;
      width: 80%;
      justify-content: space-between;
      align-items: center;

      .checkbox-container {
        display: flex;
        align-items: center;

        label {
          font-size: 16px;
          cursor: pointer;
          font-family: dyh;
        }

        input {
          outline: none;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }
    }

    .word-btn {
      font-size: 16px;
      font-family: dyh;
      color: var(--primary);
      font-weight: bold;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .btn {
      width: 80%;
      font-size: 16px;
      margin: 25px auto 0;
    }

    .or {
      margin: 25px 0 0;
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;

      hr {
        display: block;
        width: 100%;
        height: 1.5px;
        border: 0;
        background-color: var(--border);
      }

      span {
        font-size: 18px;
        color: var(--text);
        font-family: dyh;
      }
    }

    .third-party {
      display: flex;
      justify-content: space-between;
      width: 80%;
      gap: 7px;

      .btn {
        filter: none;
        border: 1.5px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 12px;

        .icon {
          font-size: 20px;
        }

        &:hover {
          background-color: var(--hover);
        }
      }
    }

    .tip {
      display: flex;
      font-size: 16px;
      font-weight: bold;
      align-items: center;
      margin-top: 25px;
    }
  }
}
</style>
