import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/Layout.vue'),
      children: [
        // { path: '/', component: () => import('../views/Home.vue') },
        // { path: '/chat/:id', component: () => import('../views/Chat.vue'), props: true }
      ]
    },
    { path: '/login', component: () => import('../views/Login.vue') },
    { path: '/register', component: () => import('../views/Register.vue') },
    { path: '/set-pass', component: () => import('../views/SetPass.vue') }
  ]
})

export default router
