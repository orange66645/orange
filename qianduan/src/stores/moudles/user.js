import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/modules/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  actions: {
    // 登录
    async loginAction(loginForm) {
      try {
        const res = await login(loginForm)
        this.token = res.data.token
        localStorage.setItem('token', res.data.token)
        await this.getUserInfoAction()
        ElMessage.success('登录成功')
        return true
      } catch (error) {
        return false
      }
    },

    // 获取用户信息
    async getUserInfoAction() {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data
        return true
      } catch (error) {
        return false
      }
    },

    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})