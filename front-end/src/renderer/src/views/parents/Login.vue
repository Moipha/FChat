<script lang="ts" setup>
import Btn from '@r/components/form/Btn.vue'
import Checkbox from '@r/components/form/Checkbox.vue'
import LoginCard from '@r/views/children/LoginCard.vue'
import Input from '@r/components/form/Input.vue'
import Titlebar from '@r/components/layout/Titlebar.vue'
import Register from '@r/components/layout/Register.vue'
import { ref, watch } from 'vue'
import request from '@r/utils/request'
import md5 from 'md5'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@r/stores/user'
import { useSettingStore } from '@r/stores/setting'
import { RSAEncryption } from '@r/utils/cryptoUtils'

// 获取store数据
const { user, token, chatList } = storeToRefs(useUserStore())
const { nav, routeMap } = storeToRefs(useSettingStore())

// 切换注册
const showRegister = ref(false)

watch(showRegister, (cur) => {
  msg.value = cur ? "Let's Get Started! ^^" : "Welcome, Let's Chat! :)"
})
// 左侧信息
const msg = ref("Welcome, Let's Chat! :)")

// 是否记住账号
const remember = ref(false)

// 登录用户信息
const curUser = ref({ email: 'young@test.cn', password: '123123' }) // 用户信息

// 用户登录
async function userLogin() {
  const { email, password } = curUser.value
  // 输入校验
  try {
    const res = await request.post('/user/login', { email, password: md5(password) })
    if (res && res.code === 200) {
      loginSuccess(res.data)
    }
  } catch (err) {
    curUser.value.password = ''
  }
}

// 登录成功执行
async function loginSuccess(data) {
  // 在本地保存token
  token.value = data && data.token
  // 本地保存用户信息
  user.value = data && data.user
  // 如果用户没有公钥，在本地生成公私钥，私钥存储在本地，公钥上传服务器
  if (!user.value.publicKey) {
    const { publicKey, privateKey } = await RSAEncryption().create()
    // 本地存储私钥
    const account = user.value._id
    const key = JSON.stringify(privateKey)
    window.api.storePrivateKey(account, key)
    // 上传公钥
    const res = await request.put('/user/' + user.value._id, {
      publicKey: JSON.stringify(publicKey)
    })
    if (res.code === 200) {
      const { data } = res
      user.value = data
    }
  }
  // 修改nav
  nav.value = 'chat'
  // 获取消息列表
  const res = await request.get('/user/aside')
  chatList.value = res.data

  // 打开主界面窗口
  window.api?.openNewWindow({
    height: 600,
    width: 900,
    minWidth: 640,
    minHeight: 540,
    route: routeMap.value['chat']
  })
}

// github授权登录
function githubAuth() {
  // 打开github授权登录页面
  const { VITE_GITHUB_CLIENT_ID: id, VITE_REDIRECT_URI: uri } = import.meta.env
  const url = `https://github.com/login/oauth/authorize?client_id=${id}&redirect_uri=${uri}&scope=user`
  window.api.openExternal(url)
  // 开始监听主进程回调
  window.api.githubLogin((res) => {
    if (res.code === 200) {
      loginSuccess(res.data)
    } else {
      window.$notify('授权登录失败，请重新进行授权')
    }
  })
}
</script>

<template>
  <main>
    <LoginCard :msg="msg" />
    <div
      class="login"
      :style="{
        left: showRegister ? 0 : '50%',
        webkitAppRegion: showRegister ? 'drag' : 'no-drag'
      }"
    >
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
        <Checkbox v-model="remember">记住账号</Checkbox>
        <span class="word-btn" @click="$notify('该功能暂未实现，抱歉~~')">忘记密码?</span>
      </div>
      <Btn class="btn" type="primary" @click="userLogin">登录</Btn>
      <div class="or">
        <hr />
        <span>或</span>
        <hr />
      </div>
      <div class="third-party">
        <Btn @click="$notify('该功能暂未实现，抱歉~~')">
          <Icon class="icon" name="wechat" />使用微信登录
        </Btn>
        <Btn @click="githubAuth"> <Icon class="icon" name="github" />使用Github登录 </Btn>
      </div>
      <div class="tip">
        <span>没有账号？</span>
        <span class="word-btn" @click="showRegister = true">点击注册</span>
      </div>
    </div>
    <Register v-model="showRegister" />
  </main>
  <Titlebar :minimize="false" :maximize="false" :height="15" />
</template>

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
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    transition: 0.4s all;
    z-index: 0;

    .drag {
      height: 50px;
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
