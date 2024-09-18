import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@r/views/parents/Layout.vue'),
      children: [
        { path: '/', component: () => import('@r/views/children/Home.vue') },
        { path: '/chat/:id', component: () => import('@r/views/children/Chat.vue'), props: true },
        {
          path: '/friend/:id',
          component: () => import('@r/views/children/Friend.vue'),
          props: true
        },
        { path: '/add-list', component: () => import('@r/views/children/AddList.vue') }
      ]
    },
    { path: '/login', component: () => import('@r/views/parents/Login.vue') },
    { path: '/register', component: () => import('@r/views/parents/Register.vue') },
    { path: '/emoji', component: () => import('@r/views/parents/Emoji.vue') },
    { path: '/add-friend', component: () => import('@r/views/parents/AddFriend.vue') },
    {
      path: '/add-info',
      component: () => import('@r/views/parents/AddInfo.vue'),
      props: true
    }
  ]
})

export default router
