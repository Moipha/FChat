<template>
  <main>
    <div class="register">
      <h1 class="secondary-title">Sign up</h1>
    </div>
    <div class="login">
      <h1 class="primary-title">Login</h1>
      <FBtn class="btn" label="Go!" @click="login" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import FBtn from '../components/FBtn.vue'
function login() {
  window.api.openNewWindow({
    height: 600,
    width: 900
  })
}
</script>

<style lang="scss" scoped>
main {
  background: linear-gradient(210deg, var(--text), var(--primary));
  color: var(--btn-text);
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;

  .register {
    margin-top: 60px;
    .secondary-title {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin: 0;
    }
  }
  .login {
    background-color: var(--bg);
    // height: calc(100vh - 112px);
    border-radius: 0 0 10px 10px;
    position: relative;
    top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .primary-title {
      color: var(--primary);
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      margin: 0;
      position: relative;
      bottom: 40px;
      z-index: 2;
    }

    .btn {
      width: 200px;
    }

    &::before {
      content: '';
      position: absolute;
      top: -50px;
      left: 0;
      z-index: 1;
      background-color: var(--bg);
      clip-path: ellipse(50% 80% at 50% 100%);
      height: 50px;
      width: 100%;
    }
  }
}
</style>
