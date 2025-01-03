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
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16M4 6h16M4 18h16"/></svg>`
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
    ],
    [
      'exit',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20.935 20.822H24V7.414H5.746V3.2L0 8.946l5.746 5.746v-4.213h15.189v7.28H2.988v3.065z"/></svg>`
    ],
    [
      'nav-chats',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/></g></svg>`
    ],
    [
      'nav-settings',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m19.85 8.75l4.15.83v4.84l-4.15.83l2.35 3.52l-3.43 3.43l-3.52-2.35l-.83 4.15H9.58l-.83-4.15l-3.52 2.35l-3.43-3.43l2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23L5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15l3.52-2.35l3.43 3.43zm-1.57 5.07l4-.81v-2l-4-.81l-.54-1.3l2.29-3.43l-1.43-1.43l-3.43 2.29l-1.3-.54l-.81-4h-2l-.81 4l-1.3.54l-3.43-2.29l-1.43 1.43L6.38 8.9l-.54 1.3l-4 .81v2l4 .81l.54 1.3l-2.29 3.43l1.43 1.43l3.43-2.29l1.3.54l.81 4h2l.81-4l1.3-.54l3.43 2.29l1.43-1.43l-2.29-3.43zm-8.186-4.672A3.43 3.43 0 0 1 12 8.57A3.44 3.44 0 0 1 15.43 12a3.43 3.43 0 1 1-5.336-2.852m.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0 0 13.71 12a1.71 1.71 0 1 0-2.66 1.422" clip-rule="evenodd"/></svg>`
    ],
    [
      'nav-groups',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 1H6c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h1v3l3-3h4c.55 0 1-.45 1-1V9h1l3 3V9h1c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM9 11H4.5L3 12.5V11H1V5h4v3c0 .55.45 1 1 1h3v2zm6-3h-2v1.5L11.5 8H6V2h9v6z" fill="currentColor"/></svg>`
    ],
    [
      'nav-profile',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21.008 3c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3zM20 5H4v14h16zm-2 10v2H6v-2zm-6-8v6H6V7zm6 4v2h-4v-2zm-8-2H8v2h2zm8-2v2h-4V7z"/></svg>`
    ],
    [
      'nav-friends',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.755 14a2.25 2.25 0 0 1 2.248 2.25v.575c0 .894-.32 1.759-.9 2.438c-1.57 1.833-3.957 2.738-7.103 2.738s-5.532-.905-7.098-2.74a3.75 3.75 0 0 1-.898-2.434v-.578A2.25 2.25 0 0 1 6.253 14zm0 1.5H6.252a.75.75 0 0 0-.75.75v.577c0 .535.192 1.053.54 1.46c1.253 1.469 3.22 2.214 5.957 2.214c2.739 0 4.706-.745 5.963-2.213a2.25 2.25 0 0 0 .54-1.463v-.576a.75.75 0 0 0-.748-.749M12 2.005a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7"/></svg>`
    ],
    [
      'right',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m19 12l12 12l-12 12"/></svg>`
    ],
    [
      'edit',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="currentColor" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.19 2.19 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg>`
    ],
    [
      'email',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z"/></svg>`
    ],
    [
      'heart',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3"/></svg>`
    ],
    [
      'add-friend',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10M8 7a3 3 0 1 1 6 0a3 3 0 0 1-6 0M4 18.5c0-.18.09-.489.413-.899c.316-.4.804-.828 1.451-1.222C7.157 15.589 8.977 15 11 15q.563 0 1.105.059a1 1 0 1 0 .211-1.99A13 13 0 0 0 11 13c-2.395 0-4.575.694-6.178 1.672c-.8.488-1.484 1.064-1.978 1.69C2.358 16.976 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986c.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22l.685-.005a1 1 0 1 0-.027-2L11 20c-2.19 0-4.083-.143-5.4-.492c-.663-.175-1.096-.382-1.345-.582C4.037 18.751 4 18.622 4 18.5M18 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1"/></g></svg>`
    ],
    [
      'log',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path d="M6 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m1 3a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1"/><path fill-rule="evenodd" d="M2 4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm3-1h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1" clip-rule="evenodd"/></g></svg>`
    ],
    [
      'search',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>`
    ],
    [
      'theme-switch',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362t.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75"/></svg>`
    ],
    [
      'play',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><g fill="none"><defs><mask id="IconifyId191daf232f0687046"><path fill="#fff" d="M0 0h26v26H0z"/><path fill="#000" d="M18.544 12.59a1 1 0 0 1-.053 1.728L9.476 19.2A1 1 0 0 1 8 18.321V7.804a1 1 0 0 1 1.53-.848z"/></mask></defs><circle cx="13" cy="13" r="13" fill="currentColor" mask="url(#IconifyId191daf232f0687046)"/></g></svg>`
    ],
    [
      'pause',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><g fill="none"><defs><mask id="IconifyId191daf232f0687048"><path fill="#fff" d="M0 0h26v26H0z"/><path fill="#000" fill-rule="evenodd" d="M9.75 6a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2m6.5 0a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2" clip-rule="evenodd"/></mask></defs><circle cx="13" cy="13" r="13" fill="currentColor" mask="url(#IconifyId191daf232f0687048)"/></g></svg>`
    ],
    [
      'notify',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M905.616 711.888c-37.344-45.424-88.48-109.742-88.48-175.358V327.57c0-180.016-134.64-326.479-306.688-326.479c-172.08 0-305.664 146.464-305.664 326.479v208.96c0 64.512-55.489 125.487-90.672 172.799c-31.649 42.512-56.624 76.096-39.76 109.664c14.832 29.536 51.968 33.328 82.655 33.328h183.36c.048 94.208 76.448 170.576 170.672 170.576c94.24 0 170.641-76.368 170.688-170.576h187.664c19.52 0 65.152 0 80.863-33.2c15.857-33.616-9.52-64.513-44.64-107.232zm-394.609 243.97c-57.216 0-103.632-46.352-103.712-103.536h207.424c-.08 57.184-46.464 103.535-103.712 103.535zm358.384-171.665H157.006c-4.896 0-8.991-.16-12.367-.368c6.592-10.208 16.271-23.248 24.143-33.857c38.993-52.4 104.145-126.368 104.145-213.424v-208.96c0-142.464 103.04-258.352 237.521-258.352S749.01 185.12 749.01 327.584v208.96c0 90.016 60.08 165.248 103.968 218.608c7.392 8.993 16.24 19.76 23.12 28.96c-2.033.048-4.273.08-6.705.08z"/></svg>`
    ],
    [
      'online',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/></g></svg>`
    ],
    [
      'offline',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path stroke="currentColor" d="M5 5a9.85 9.85 0 0 0-3 7.083C2 17.56 6.477 22 12 22a10 10 0 0 0 7-2.835"/><path stroke="currentColor" d="M15.5 16c-.617 3.532-1.86 6-3.5 6c-2.21 0-4-4.477-4-10c0-1.231.089-2.41.252-3.5M2 12h10"/><path fill="currentColor" d="M7.162 2.398a.75.75 0 0 0 .676 1.339zm13.1 13.764a.75.75 0 0 0 1.34.676zM16 12h-.75c0 .414.336.75.75.75zM8.303 4.726a.75.75 0 0 0 1.396.548zM12 2.75A9.25 9.25 0 0 1 21.25 12h1.5c0-5.937-4.813-10.75-10.75-10.75zm-4.162.987A9.2 9.2 0 0 1 12 2.75v-1.5a10.7 10.7 0 0 0-4.838 1.148zM21.25 12a9.2 9.2 0 0 1-.987 4.162l1.339.676A10.7 10.7 0 0 0 22.75 12zM12 2.75c.28 0 .622.139 1.012.551c.392.414.78 1.054 1.12 1.906c.68 1.701 1.118 4.103 1.118 6.793h1.5c0-2.832-.458-5.431-1.225-7.35c-.383-.957-.858-1.782-1.423-2.38c-.567-.599-1.277-1.02-2.102-1.02zM9.7 5.274c.335-.855.755-1.51 1.183-1.938c.433-.432.822-.586 1.117-.586v-1.5c-.824 0-1.572.42-2.177 1.025c-.61.61-1.13 1.455-1.52 2.451zM16 12.75h6v-1.5h-6z"/><path stroke="currentColor" d="m2 2l20 20"/></g></svg>`
    ],
    [
      'mention',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20.226 7.25c-2.623-4.542-8.432-6.098-12.974-3.475c-4.543 2.622-6.099 8.431-3.477 12.974c2.623 4.542 8.431 6.099 12.974 3.477a.75.75 0 0 1 .75 1.299c-5.26 3.037-11.987 1.235-15.024-4.026C-.562 12.24 1.24 5.512 6.501 2.475C11.76-.562 18.488 1.24 21.525 6.501a10.96 10.96 0 0 1 1.455 4.826q.02.084.02.173v2.25a3.5 3.5 0 0 1-6.623 1.581a5.5 5.5 0 1 1 1.112-3.682a1 1 0 0 1 .011.129v1.972a2 2 0 1 0 4 0v-1.766a9.46 9.46 0 0 0-1.274-4.733ZM16 12a4 4 0 1 0-8 0a4 4 0 0 0 8 0"/></svg>`
    ],
    [
      'delete',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M1 3.5h12m-10.5 0h9v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9h0Zm2 0V3a2.5 2.5 0 0 1 5 0v.5m-4 2V11m3-5.5V11"/></svg>`
    ],
    [
      'pinned',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1990 748q-33 33-64 60t-65 47t-73 29t-90 11q-34 0-65-6l-379 379q13 38 19 78t6 80q0 65-13 118t-37 100t-60 89t-79 87l-386-386l-568 569l-136 45l45-136l569-568l-386-386l45-45q70-70 160-107t190-37q82 0 157 25l379-379q-6-31-6-65q0-49 10-88t30-74t46-65t61-65zm-292 19q55 0 104-26l-495-495q-26 49-26 104q0 28 6 52t15 51L810 944q-25-10-47-19t-44-15t-45-9t-51-4q-57 0-110 16t-100 49l673 673q32-46 49-99t17-110q0-27-3-50t-10-46t-16-45t-19-47l491-492q26 8 50 14t53 7"/></svg>`
    ],
    [
      'remove',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="6.5"/><path d="M4 7h6"/></g></svg>`
    ],
    [
      'block',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0a12 12 0 0 1 12 12a12 12 0 0 1-12 12A12 12 0 0 1 0 12A12 12 0 0 1 12 0m0 2A10 10 0 0 0 2 12c0 2.4.85 4.6 2.26 6.33L18.33 4.26A10 10 0 0 0 12 2m0 20a10 10 0 0 0 10-10c0-2.4-.85-4.6-2.26-6.33L5.67 19.74A10 10 0 0 0 12 22"/></svg>`
    ],
    [
      'share',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3M160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.2 196.2 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"/></svg>`
    ],
    [
      'github',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>`
    ],
    [
      'wechat',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018c0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117a.166.166 0 0 1-.162.162a.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074a.5.5 0 0 0-.142.021a5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1a.645.645 0 0 0-.646.647a.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1a.645.645 0 0 0-.644.644a.63.63 0 0 0 .098.356"/><path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6l-.1.373a.5.5 0 0 0-.032.14a.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26a4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2C2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0a.77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0a.77.77 0 0 1 1.54 0"/></g></svg>`
    ],
    [
      'nav-logout',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/></svg>`
    ],
    [
      'file',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4"/><path fill="currentColor" d="M419.22 188.59L275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41"/></svg>`
    ],
    [
      'ai',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M14.17 20.89c4.184-.277 7.516-3.657 7.79-7.9c.053-.83.053-1.69 0-2.52c-.274-4.242-3.606-7.62-7.79-7.899a33 33 0 0 0-4.34 0c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184c.467.845.159 1.9-.328 2.823c-.35.665-.526.997-.385 1.237c.14.24.455.248 1.084.263c1.245.03 2.084-.322 2.75-.813c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34c1.425.094 2.914.094 4.342 0"/><path d="m7.5 15l1.842-5.526a.694.694 0 0 1 1.316 0L12.5 15m3-6v6m-7-2h3"/></g></svg>`
    ],
    [
      'bot',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2m16 0h2m-7-1v2m-6-2v2"/></g></svg>`
    ],
    [
      'add',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><rect width="36" height="36" x="6" y="6" rx="3"/><path stroke-linecap="round" d="M24 16v16m-8-8h16"/></g></svg>`
    ],
    [
      'loading',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12"><animateTransform attributeName="transform" attributeType="XML" dur="560ms" from="0,12,12" repeatCount="indefinite" to="360,12,12" type="rotate"/></path></svg>`
    ]
  ])
)
</script>
<style lang="scss" scoped>
div {
  display: flex;
  width: 1em;
}
</style>
