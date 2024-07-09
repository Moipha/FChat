<template>
  <form class="otp-Form">
    <span class="mainHeading">请输入验证码</span>
    <p class="otpSubheading">我们已向您的邮箱中发送了四位验证码，请注意查收</p>
    <div class="inputContainer">
      <input id="otp-input1" required="required" maxlength="1" type="text" class="otp-input" />
      <input id="otp-input2" required="required" maxlength="1" type="text" class="otp-input" />
      <input id="otp-input3" required="required" maxlength="1" type="text" class="otp-input" />
      <input id="otp-input4" required="required" maxlength="1" type="text" class="otp-input" />
    </div>
    <FBtn class="verifyButton" label="验证" />
    <p class="resendNote">未收到验证码？<button class="resendBtn">重新发送</button></p>
  </form>
</template>

<script lang="ts" setup>
import FBtn from '../components/FBtn.vue'
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

  .verifyButton:hover {
    background-color: var(--primary);
    transition-duration: 0.2s;
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
}
</style>
