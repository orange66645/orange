// 分类管理相关接口
import request from '../request'

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

// 添加分类
export function addCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(categoryId, data) {
  return request({
    url: `/category/${categoryId}`,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(categoryId) {
  return request({
    url: `/admin/category/${categoryId}`,
    method: 'delete'
  })
}