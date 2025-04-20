import request from './request'

// 登录接口
export function login(data) {
  return request({
    url: '/user/login',  // 移除'/api'前缀，因为已经在baseURL中配置
    method: 'post',
    data
  })
}

// 注册接口
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 上传头像
export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
// 获取用户列表
export function getUserList() {
  return request({
    url: '/user/list/all',
    method: 'get'
  })
}




// 获取点赞历史
export function getLikeHistory(params) {
  return request({
    url: '/user/like/history',
    method: 'get',
    params
  })
}

// 取消点赞
export function unlikeNovel(novelId) {
  return request({
    url: `/user/like/${novelId}`,
    method: 'delete'
  })
}