<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="icons.get(name)" />
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  name: {
    type: String,
    required: true
  }
})
const icons = ref(
  new Map([
    [
      'menu',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8h12M6 12h12M6 16h12" / </svg>`
    ],
    [
      'minimize',
      `<svg t="1721895431791" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2565" width="1em" height="1em"><path d="M52.37546667 445.632l933.27253333-2.1248 0.17386667 68.26666667-933.27253334 2.1248z" p-id="2566"></path></svg>`
    ],
    [
      'maximize',
      `<svg t="1721895375143" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2151" width="1em" height="1em"><path d="M180.592 168.48v683.46h683.46V168.48zM95.16 83.049h854.324v854.325H95.16z" p-id="2152"></path></svg>`
    ],
    [
      'restore',
      `<svg t="1721895452957" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2739" width="1em" height="1em"><path d="M165.712 334.501v537.51h537.51V334.5z m179.17-179.17v89.585h447.924v447.925h89.585V155.33z m-89.585-89.584h716.68v716.678h-179.17v179.17H76.126V244.916h179.17z" p-id="2740"></path></svg>`
    ],
    [
      'close',
      `<svg t="1721895468277" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2913" width="1em" height="1em"><path d="M577.574 512l343.643-343.696a45.008 45.008 0 0 0 0-63.3l-1.885-1.842a44.997 44.997 0 0 0-63.288 0L512.348 447.29 168.662 103.162a45.008 45.008 0 0 0-63.3 0l-1.874 1.874a44.165 44.165 0 0 0 0 63.3L447.174 512 103.488 855.686a44.987 44.987 0 0 0 0 63.299l1.875 1.874a45.008 45.008 0 0 0 63.299 0l343.686-343.685 343.696 343.685a44.997 44.997 0 0 0 63.288 0l1.885-1.874a45.008 45.008 0 0 0 0-63.3z" p-id="2914"></path></svg>`
    ],
    [
      'send',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"/></svg>`
    ],
    [
      'emoji',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="0" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"/><path stroke-dasharray="14" stroke-dashoffset="0" d="M8 14C8.5 15.5 9.79086 17 12 17C14.2091 17 15.5 15.5 16 14"/></g><g fill="currentColor" fill-opacity="1"><ellipse cx="9" cy="9.5" rx="1" ry="1.5"/><ellipse cx="15" cy="9.5" rx="1" ry="1.5"/></g></svg>`
    ],
    [
      'link',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24.7073 9.56521L9.85801 24.4145C6.34329 27.9292 6.34329 33.6277 9.85801 37.1424V37.1424C13.3727 40.6571 19.0712 40.6571 22.5859 37.1424L40.2636 19.4647C42.6067 17.1216 42.6067 13.3226 40.2636 10.9794V10.9794C37.9205 8.63628 34.1215 8.63628 31.7783 10.9794L14.1007 28.6571C12.9291 29.8287 12.9291 31.7282 14.1007 32.8997V32.8997C15.2722 34.0713 17.1717 34.0713 18.3433 32.8997L33.1925 18.0505"/></svg>`
    ],
    [
      'audio',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M128 180a52.06 52.06 0 0 0 52-52V64a52 52 0 0 0-104 0v64a52.06 52.06 0 0 0 52 52M100 64a28 28 0 0 1 56 0v64a28 28 0 0 1-56 0Zm40 155.22V240a12 12 0 0 1-24 0v-20.78A92.14 92.14 0 0 1 36 128a12 12 0 0 1 24 0a68 68 0 0 0 136 0a12 12 0 0 1 24 0a92.14 92.14 0 0 1-80 91.22"/></svg>`
    ],
    [
      'text',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M14 3.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm2 8.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75M11 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2M9 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2m8.5-3.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-4 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-2-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-4 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>`
    ],
    [
      'else',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><circle cx="8" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><circle cx="24" cy="16" r="2" fill="currentColor"/></svg>`
    ]
  ])
)
</script>
<style lang="scss" scoped>
div {
  display: flex;
}
</style>
