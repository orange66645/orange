// import request from './request'
import request from './request'
// 获取帖子列表
export function getForumPosts(params) {
  return request({
    url: '/forum/post/list',
    method: 'get',
    params
  })
}

// 发布帖子
export function createPost(data) {
  return request({
    url: '/forum/post/create',
    method: 'post',
    data
  })
}
// 获取帖子详情
export function getPostDetail(id) {
  return request({
    url: `/forum/post/${id}`,
    method: 'get'
  })
}

// 回复帖子
export function replyPost(data) {
  return request({
    url: '/forum/reply/create',
    method: 'post',
    data
  })
}
