/**
 * 封装axios请求
 */
import axios from 'axios'
import { useUserStore } from '@r/stores/user'
import router from '@r/router'

const { token } = useUserStore()
const { VITE_PORT, VITE_IP } = import.meta.env

const request = axios.create({
  // baseURL: '/api',
  baseURL: `http://${VITE_IP}:${VITE_PORT}`,
  timeout: 1000 * 5,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      // 如果token过期，跳转到登录页面
      router.push('/login')
    }
    window.$notify(err.response ? err.response.data.msg : '网络异常')
    console.error('错误的响应: ' + err)
    return Promise.reject(err)
  }
)
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果本地保存了token，携带token发送请求
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (err) => {
    console.error('请求拦截器发生错误:', err)
    return Promise.reject(err)
  }
)

export default request
