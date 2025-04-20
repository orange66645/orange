// 用户管理相关接口
import request from '../request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      username: params.username,
      status: params.status
    }
  })
}

// 更新用户状态
export function updateUserStatus(userId, status) {
  return request({
    url: '/user/status',
    method: 'put',
    data: {
      userId,
      status
    }
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'delete'
  })
}

// 重置用户密码
export function resetUserPassword(userId) {
  return request({
    url: `/user/reset-password/${userId}`,
    method: 'put'
  })
}
// 添加用户
export function addUser(data) {
    return request({
      url: '/user',
      method: 'post',
      data
    })
  }
  
  // 更新用户
  export function updateUser(data) {
    return request({
      url: `/user/${data.id}`,
      method: 'put',
      data
    })
  }