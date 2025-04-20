// 评论管理相关接口
import request from '../request'

// 获取评论列表
export function getCommentList(params) {
  return request({
    url: '/comment/list',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      content: params.content,
      status: params.status
    }
  })
}

// 删除评论
export function deleteComment(commentId) {
  return request({
    url: `/comment/${commentId}`,
    method: 'delete'
  })
}

// 更新评论状态
export function updateCommentStatus(commentId, status) {
  return request({
    url: '/comment/status',
    method: 'put',
    data: {
      commentId,
      status
    }
  })
}