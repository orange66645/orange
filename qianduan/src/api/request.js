import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api', // 修改这里，使用代理
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('收到响应:', response.data)  // 添加日志
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    ElMessage.error(error.response?.data?.message || '网络连接失败')
    return Promise.reject(error)
  }
)

export default service