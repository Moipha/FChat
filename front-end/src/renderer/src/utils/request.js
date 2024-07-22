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
export default request
