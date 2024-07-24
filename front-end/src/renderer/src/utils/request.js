/**
 * 封装axios请求
 */
import axios from 'axios'
const request = axios.create({
  baseURL: '/api',
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
    console.log(err)
  }
)
export default request
