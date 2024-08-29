<template>
  <div class="container">
    <div class="options scroll-bar">
      <div v-for="[key, value] in map" :key="key" class="option" @click="chooseEmoji(key)">
        <img :src="emoji.path + value" :alt="key" />
      </div>
    </div>
    <div class="nav">
      <div class="option active">
        <Icon name="emoji" />
      </div>
      <div class="option">
        <Icon name="heart" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import emoji from '@r/../public/emoji'
import Icon from '@r/components/form/Icon.vue'

const map = Object.entries(emoji.map)
// 选中表情
function chooseEmoji(key) {
  window.api.sendEmoji(key)
  window.api.closeDialog()
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: var(--bg);
  position: absolute;
  color: var(--text);
  display: flex;
  flex-direction: column;

  .options {
    padding: 15px 15px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;

    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background-color: var(--bg);
      cursor: pointer;
      border-radius: 5px;

      img {
        width: 32px;
        height: 32px;
      }
      &:hover {
        background-color: var(--border);
        filter: brightness(1.1);
      }
    }
  }

  .nav {
    margin-top: auto;
    display: flex;
    height: 80px;
    background-color: var(--bg);
    box-shadow: inset 0 0px 2px var(--light-text);

    .option {
      color: var(--primary);
      font-size: 30px;
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .active {
      background-color: var(--primary);
      color: var(--btn-text);
    }
  }
}
</style>
