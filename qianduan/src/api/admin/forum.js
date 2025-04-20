import request from '../request'

// 获取论坛帖子列表
export function getForumList(params) {
  return request({
    url: '/admin/forum/list',
    method: 'get',
    params
  })
}

// 删除帖子
export function deleteForum(id) {
  return request({
    url: `/admin/forum/${id}`,
    method: 'delete'
  })
}