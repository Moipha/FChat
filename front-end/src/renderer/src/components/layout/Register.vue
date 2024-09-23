<template>
  <div class="register" :style="{ right: modelValue ? '0' : '-50%' }">
    <h1 class="title">注册一个新的账户</h1>
    <Input v-model="user.email" placeholder="name@mail.com" label="邮箱" class="input-container" />
    <Btn class="btn" type="primary" label="验证邮箱" @click="verify" />
    <Btn class="return btn" label="返回登录" @click="emits('update:modelValue', false)" />
    <div class="drag" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Input from '@r/components/form/Input.vue'
import Btn from '@r/components/form/Btn.vue'
import { useSignStore } from '@r/stores/sign'
import { storeToRefs } from 'pinia'
import request from '@r/utils/request'

const { newUser, lastSendTime } = storeToRefs(useSignStore())

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

// 新注册的用户
const user = ref({})

// 验证邮箱
async function verify() {
  // 校验邮箱格式
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const ok = reg.test(String(user.value.email).toLowerCase())
  if (!ok) {
    window.$notify('邮箱格式有误')
    return
  }
  // 检查邮箱是否已注册
  try {
    const res = await request.get('/user/email', { params: { email: user.value.email } })
    if (res.data) {
      window.$notify('该邮箱已被注册')
    } else {
      // 判断上次发送时间
      if (Date.now() - lastSendTime.value < 60 * 1000) {
        window.$notify(
          `请等待 ${60 - parseInt((Date.now() - lastSendTime.value) / 1000)} 秒后再次发送`
        )
        return
      }
      // 发送验证邮件
      await request.post('/user/send-verify', { email: user.value.email })
      lastSendTime.value = Date.now()
      // 验证通过，保存邮箱至本地
      newUser.value.email = user.value.email
      user.value.email = ''

      window.api.openDialog({
        route: '/register',
        width: 320,
        height: 420,
        modal: true,
        frame: true
      })
    }
  } catch (e) {
    window.$notify('验证码发送失败')
    console.error(e)
  }
}
// 绑定注册回调
window.api?.registerCallback((res) => {
  window.$notify(`注册${res ? '成功!' : '失败..'}`)
})
</script>

<style lang="scss" scoped>
.register {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg);
  transition: 0.4s all ease;
  -webkit-app-region: no-drag;

  .title {
    font-size: 25px;
    font-family: dyh;
    font-weight: normal;
  }

  .input-container {
    padding: 10px 20px;
    width: 80%;
    margin-bottom: 10px;
  }

  .btn {
    width: 80%;
    margin: 10px auto;
  }

  .return {
    filter: none;
    border: 1.5px solid var(--border);

    &:hover {
      background-color: var(--hover);
    }
  }
  .drag {
    height: 120px;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    -webkit-app-region: drag;
  }
}
</style>
