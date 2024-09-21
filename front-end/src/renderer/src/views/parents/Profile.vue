<template>
  <div class="profile-container">
    <div class="title">
      <Icon class="icon" name="nav-profile" />
      <span>个人资料</span>
    </div>
    <hr />
    <div class="settings">
      <section class="left"></section>
      <section class="right">
        <span class="text">头像</span>
        <Avatar :src="user.avatar" shape="circle" :size="150" />
      </section>
    </div>
  </div>
  <Titlebar />
</template>

<script lang="ts" setup>
import Titlebar from '@r/components/layout/Titlebar.vue'
import Avatar from '@r/components/form/Avatar.vue'
import { useUserStore } from '@r/stores/user'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  height: 100vh;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  -webkit-app-region: drag;

  .title {
    font-size: 23px;
    position: relative;
    font-weight: normal;
    justify-self: center;
    margin: 15px 0 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;

    .icon {
      font-size: 30px;
    }
  }

  hr {
    border-top: 1.5px solid var(--border);
    width: 100%;
  }

  .settings {
    display: flex;

    .left {
      flex: 1;
    }

    .right {
      display: flex;
      flex-direction: column;
      padding: 50px 20px;

      .text {
        font-size: 20px;
        position: relative;
        font-weight: bold;
        margin-bottom: 10px;

        &::after {
          position: absolute;
          content: '';
          width: 40px;
          height: 3px;
          background-color: var(--primary);
          left: 0;
          bottom: -2px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
