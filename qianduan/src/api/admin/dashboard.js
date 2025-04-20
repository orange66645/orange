// 仪表盘相关接口
import request from '../request'

// 获取仪表盘数据
export function getDashboardData() {
  return request({
    url: '/admin/dashboard',
    method: 'get'
  })
}

