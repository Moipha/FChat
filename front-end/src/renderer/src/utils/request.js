/**
 * 封装axios请求
 */
import axios from 'axios'
import { useUserStore } from '@r/stores/user'
const { token } = useUserStore()
import config from '@/config'
const { PORT, IP } = config

const request = axios.create({
  // baseURL: '/api',
  baseURL: `http://${IP}:${PORT}`,
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
    console.log('错误的响应: ' + err)
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
