// 小说管理相关接口
import request from '../request'

// 获取小说列表
export function getNovelList(params) {
  return request({
    url: '/book/admin/list',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      title: params.title,
      status: params.status,
      categoryId: params.categoryId,
      authorName: params.authorName
    }
  })
}

// 更新小说状态
export function updateNovelStatus(novelId, status) {
  return request({
    url: '/book/admin/status',
    method: 'put',
    data: {
      novelId,
      status
    }
  })
}

// 删除小说
export function deleteNovel(novelId) {
  return request({
    url: `/book/admin/${novelId}`,
    method: 'delete'
  })
}

// 审核小说
export function auditNovel(novelId, status, remark) {
  return request({
    url: '/book/admin/audit',
    method: 'put',
    data: {
      novelId,
      status,
      remark
    }
  })
}

// 获取小说详情
export function getNovelDetail(novelId) {
  return request({
    url: `/book/admin/${novelId}`,
    method: 'get'
  })
}

// 更新小说信息
export function updateNovel(data) {
  return request({
    url: `/book/admin/${data.id}`,
    method: 'put',
    data
  })
}

// 新增小说
export function addNovel(data) {
  return request({
    url: '/book/admin',
    method: 'post',
    data
  })
}